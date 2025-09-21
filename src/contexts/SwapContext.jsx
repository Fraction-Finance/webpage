import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { useMarkets } from './MarketsContext';
import { useToast } from '@/components/ui/use-toast';
import { ethers, parseUnits, formatUnits } from 'ethers';
import { Token, Percent, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, SwapRouter, Trade } from '@uniswap/v3-sdk';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { SWAP_ROUTER_ADDRESS, QUOTER_CONTRACT_ADDRESS, ERC20_ABI } from '@/lib/constants';

const SwapContext = createContext();

export const useSwap = () => useContext(SwapContext);

export const SwapProvider = ({ children }) => {
  const { toast } = useToast();
  const { provider, wallet, isConnected } = useWallet();
  const { swapTokens } = useMarkets();

  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(null);
  const [balances, setBalances] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  const [trade, setTrade] = useState(null);

  useEffect(() => {
    if (wallet.network) {
      const networkChainId = parseInt(wallet.network.chainId, 16);
      const defaultFrom = swapTokens.find(t => t.symbol === 'WETH' && t.chainId === networkChainId);
      const defaultTo = swapTokens.find(t => t.symbol === 'USDC' && t.chainId === networkChainId);
      setFromToken(defaultFrom || null);
      setToToken(defaultTo || null);
    } else {
      setFromToken(null);
      setToToken(null);
    }
  }, [wallet.network, swapTokens]);

  const getPoolInfo = async (tokenIn, tokenOut) => {
    if (!provider) throw new Error("Provider not available");
    const currentPoolAddress = Pool.getAddress(tokenIn, tokenOut, 3000);
    const poolContract = new ethers.Contract(currentPoolAddress, IUniswapV3PoolABI, provider);
    const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
    return { token0, token1, fee, tickSpacing, liquidity, sqrtPriceX96: slot0[0], tick: slot0[1] };
  };

  const getQuote = useCallback(async () => {
    if (!provider || !fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken) {
      setToAmount('');
      return;
    }
    setLoading('quote');
    try {
      const tokenIn = new Token(fromToken.chainId, fromToken.address, fromToken.decimals, fromToken.symbol, fromToken.name);
      const tokenOut = new Token(toToken.chainId, toToken.address, toToken.decimals, toToken.symbol, toToken.name);
      
      const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, QuoterABI, provider);
      
      const amountIn = parseUnits(fromAmount.toString(), fromToken.decimals);

      const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
        tokenIn.address,
        tokenOut.address,
        3000,
        amountIn,
        0
      );

      const formattedAmount = formatUnits(quotedAmountOut, toToken.decimals);
      setToAmount(formattedAmount);
      
      const poolInfo = await getPoolInfo(tokenIn, tokenOut);
      const pool = new Pool(tokenIn, tokenOut, poolInfo.fee, poolInfo.sqrtPriceX96.toString(), poolInfo.liquidity.toString(), poolInfo.tick);
      const route = new Route([pool], tokenIn, tokenOut);
      const trade = await Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);
      setTrade(trade);

    } catch (error) {
      console.error('Error getting quote:', error);
      setToAmount('');
      toast({ title: 'Error al obtener cotización', description: 'No se pudo obtener una cotización para este par. Puede que no haya liquidez.', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  }, [provider, fromToken, toToken, fromAmount, toast]);

  const refreshBalances = useCallback(async () => {
    if (!isConnected || !wallet.address || !wallet.network) return;
    setLoading('balances');
    const newBalances = {};
    const networkChainId = parseInt(wallet.network.chainId, 16);
    const tokensForNetwork = swapTokens.filter(t => t.chainId === networkChainId);

    for (const token of tokensForNetwork) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const balance = await contract.balanceOf(wallet.address);
        newBalances[token.address] = balance;
      } catch (e) {
        console.error(`Could not fetch balance for ${token.symbol}`, e);
        newBalances[token.address] = 0n;
      }
    }
    setBalances(newBalances);
    setLoading(null);
  }, [isConnected, wallet.address, wallet.network, swapTokens, provider]);

  const checkAllowance = useCallback(async () => {
    if (!provider || !wallet.address || !fromToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setIsApproved(false);
      return;
    }
    try {
      const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, provider);
      const allowance = await tokenContract.allowance(wallet.address, SWAP_ROUTER_ADDRESS);
      const amountIn = parseUnits(fromAmount.toString(), fromToken.decimals);
      setIsApproved(allowance >= amountIn);
    } catch (e) {
      console.error("Error checking allowance:", e);
      setIsApproved(false);
    }
  }, [provider, wallet.address, fromToken, fromAmount]);

  useEffect(() => {
    if (isConnected) {
      refreshBalances();
    }
  }, [isConnected, refreshBalances]);

  useEffect(() => {
    checkAllowance();
  }, [fromAmount, fromToken, checkAllowance]);

  const approveToken = async () => {
    if (!provider || !fromToken || !fromAmount) return;
    setLoading('approve');
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);
      const amountToApprove = parseUnits(fromAmount.toString(), fromToken.decimals);
      const tx = await tokenContract.approve(SWAP_ROUTER_ADDRESS, amountToApprove);
      toast({ title: 'Aprobación en progreso', description: 'Esperando confirmación de la transacción.' });
      await tx.wait();
      setIsApproved(true);
      toast({ title: 'Aprobación exitosa', description: `${fromToken.symbol} aprobado para el intercambio.` });
    } catch (error) {
      console.error('Approval error:', error);
      toast({ title: 'Error de aprobación', description: 'No se pudo aprobar el token.', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  const performSwap = async () => {
    if (!trade || !provider || !wallet.address) return;
    setLoading('swap');
    try {
      const signer = await provider.getSigner();
      const options = {
        slippageTolerance: new Percent(Math.floor(slippage * 100), 10000),
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: wallet.address,
      };
      const methodParameters = SwapRouter.swapCallParameters(trade, options);
      
      const tx = await signer.sendTransaction({
        data: methodParameters.calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: methodParameters.value,
        from: wallet.address,
      });

      toast({ title: 'Intercambio en progreso', description: 'Esperando confirmación de la transacción.' });
      const receipt = await tx.wait();
      toast({ title: 'Intercambio exitoso', description: `Transacción confirmada: ${receipt.transactionHash}` });
      setFromAmount('');
      setToAmount('');
      refreshBalances();
    } catch (error) {
      console.error('Swap error:', error);
      toast({ title: 'Error en el intercambio', description: 'La transacción no pudo ser completada.', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  const value = {
    fromToken, setFromToken,
    toToken, setToToken,
    fromAmount, setFromAmount,
    toAmount,
    slippage, setSlippage,
    loading,
    balances,
    isApproved,
    getQuote,
    performSwap,
    refreshBalances,
    approveToken,
  };

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
};
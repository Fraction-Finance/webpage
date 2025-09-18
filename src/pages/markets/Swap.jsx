
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, RefreshCw, ChevronDown, Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CountUp from 'react-countup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useSwap } from '@/contexts/SwapContext';
import { useMarkets } from '@/contexts/MarketsContext';
import { Label } from '@/components/ui/label';
import { formatUnits } from 'ethers';

const TokenSelector = ({ selectedToken, onSelectToken, disabledTokenSymbol }) => {
  const [open, setOpen] = useState(false);
  const { swapTokens } = useMarkets();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[150px] justify-between h-12 text-lg">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <img src={selectedToken.logoURI} alt={selectedToken.name} className="h-6 w-6" />
              {selectedToken.symbol}
            </div>
          ) : "Seleccionar"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar token..." />
          <CommandEmpty>No se encontró el token.</CommandEmpty>
          <CommandGroup>
            {swapTokens.map((token) => (
              <CommandItem
                key={token.symbol}
                value={token.symbol}
                disabled={token.symbol === disabledTokenSymbol}
                onSelect={() => {
                  onSelectToken(token);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <img src={token.logoURI} alt={token.name} className="h-6 w-6" />
                <span>{token.symbol}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Swap = () => {
  const { toast } = useToast();
  const {
    fromToken, setFromToken,
    toToken, setToToken,
    fromAmount, setFromAmount,
    toAmount,
    slippage, setSlippage,
    getQuote,
    performSwap,
    loading,
    balances,
    refreshBalances,
    isApproved,
    approveToken,
  } = useSwap();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (fromAmount > 0) {
      const debounce = setTimeout(() => {
        getQuote();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [fromAmount, fromToken, toToken]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const switchTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const handleSwapAction = async () => {
    if (!isApproved) {
      await approveToken();
    } else {
      await performSwap();
    }
  };

  const fromBalance = balances[fromToken?.address] ? formatUnits(balances[fromToken.address], fromToken.decimals) : '0.00';
  const toBalance = balances[toToken?.address] ? formatUnits(balances[toToken.address], toToken.decimals) : '0.00';

  const insufficientBalance = parseFloat(fromAmount) > parseFloat(fromBalance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-start"
    >
      <Card className="w-full max-w-md glass-effect-light shadow-lg border-none">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-2xl font-bold">
            <span>Swap</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={refreshBalances}>
                <RefreshCw className={`h-5 w-5 text-gray-500 hover:text-primary transition-colors ${loading === 'balances' ? 'animate-spin' : ''}`} />
              </Button>
              <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Configuración</h4>
                      <p className="text-sm text-muted-foreground">
                        Ajusta tu tolerancia al deslizamiento.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slippage">Tolerancia al Deslizamiento</Label>
                      <div className="flex items-center gap-2">
                        <Input id="slippage" type="number" value={slippage} onChange={(e) => setSlippage(parseFloat(e.target.value))} className="w-24" />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-4 border rounded-xl bg-background/50 transition-all focus-within:ring-2 focus-within:ring-primary">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">De</span>
                <span className="text-sm text-muted-foreground">Balance: {parseFloat(fromBalance).toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  placeholder="0.0" 
                  value={fromAmount}
                  onChange={handleAmountChange}
                  className="text-3xl font-mono border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent" 
                />
                <TokenSelector selectedToken={fromToken} onSelectToken={setFromToken} disabledTokenSymbol={toToken?.symbol} />
              </div>
            </div>

            <div className="flex justify-center items-center h-8">
              <Button variant="outline" size="icon" className="rounded-full bg-background hover:bg-muted z-10" onClick={switchTokens}>
                <ArrowDown className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            <div className="p-4 border rounded-xl bg-background/50 transition-all focus-within:ring-2 focus-within:ring-primary">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">A</span>
                <span className="text-sm text-muted-foreground">Balance: {parseFloat(toBalance).toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-mono flex-1 truncate">
                  {loading === 'quote' ? <Loader2 className="h-8 w-8 animate-spin" /> :
                    <CountUp
                      start={0}
                      end={toAmount || 0}
                      duration={0.5}
                      separator=","
                      decimals={4}
                      preserveValue
                    />
                  }
                </div>
                <TokenSelector selectedToken={toToken} onSelectToken={setToToken} disabledTokenSymbol={fromToken?.symbol} />
              </div>
            </div>

            {toAmount > 0 && fromAmount > 0 && (
              <div className="text-sm text-muted-foreground pt-4 text-center">
                <p>1 {fromToken.symbol} ≈ {(toAmount / fromAmount).toFixed(4)} {toToken.symbol}</p>
              </div>
            )}

            <Button 
              size="lg" 
              className="w-full text-lg h-14 mt-4" 
              onClick={handleSwapAction}
              disabled={loading || !fromAmount || fromAmount === '0' || insufficientBalance}
            >
              {loading === 'approve' || loading === 'swap' ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
              {insufficientBalance ? 'Balance Insuficiente' : (isApproved ? 'Swap' : `Aprobar ${fromToken?.symbol}`)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Swap;

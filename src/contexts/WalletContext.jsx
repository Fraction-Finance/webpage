import React, { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ethers } from 'ethers';
import { useAlchemy } from '@/contexts/AlchemyContext';
    
const supportedChains = [
    {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://etherscan.io'],
        speed: 'Slow', cost: 'High', security: 'High', explorer: 'https://etherscan.io'
    },
    {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
        rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        speed: 'Slow', cost: 'Low', security: 'Testnet', explorer: 'https://sepolia.etherscan.io'
    },
    {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-mainnet.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://polygonscan.com/'],
        speed: 'High', cost: 'Low', security: 'High', explorer: 'https://polygonscan.com'
    },
    {
        chainId: '0x13882',
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://www.oklink.com/amoy'],
        speed: 'High', cost: 'Low', security: 'Testnet', explorer: 'https://www.oklink.com/amoy'
    },
    {
        chainId: '0x38',
        chainName: 'BNB Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bnb-mainnet.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://bscscan.com'],
        speed: 'High', cost: 'Low', security: 'Medium', explorer: 'https://bscscan.com'
    },
    {
        chainId: '0x2105',
        chainName: 'Base',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://base-mainnet.g.alchemy.com/v2/SDv-Pk8QvIj1Cd1WMtCmh'],
        blockExplorerUrls: ['https://basescan.org'],
        speed: 'Very High', cost: 'Very Low', security: 'Medium', explorer: 'https://basescan.org'
    }
];

const getNetworkByChainId = (chainId) => {
    return supportedChains.find(chain => chain.chainId === chainId);
};

export const WalletContext = createContext();

export const useWallet = () => {
    return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [balance, setBalance] = useState(null);
    const [provider, setProvider] = useState(null);
    const { toast } = useToast();
    const { getProvider: getAlchemyProvider } = useAlchemy();
    
    const [alchemyProvider, setAlchemyProvider] = useState(null);

    const updateWalletState = useCallback(async (accounts) => {
        if (accounts.length > 0) {
            const account = accounts[0];
            setCurrentAccount(account);

            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(web3Provider);

            const networkInfo = await web3Provider.getNetwork();
            const chainId = `0x${networkInfo.chainId.toString(16)}`;
            const currentNetwork = getNetworkByChainId(chainId);
            const resolvedNetwork = currentNetwork || { chainId, chainName: `Red desconocida (ID: ${chainId})` };
            setNetwork(resolvedNetwork);
            
            const weiBalance = await web3Provider.getBalance(account);
            const etherBalance = ethers.formatEther(weiBalance);
            setBalance(parseFloat(etherBalance).toFixed(4));

        } else {
            setCurrentAccount(null);
            setNetwork(null);
            setBalance(null);
            setProvider(null);
            setAlchemyProvider(null); // Clear alchemy provider on disconnect
            toast({
                title: 'Billetera Desconectada',
                description: 'Tu billetera ha sido desconectada.',
            });
        }
    }, [toast]);
    
    useEffect(() => {
        if(network && getAlchemyProvider) {
           const newAlchemyProvider = getAlchemyProvider(network);
           setAlchemyProvider(newAlchemyProvider);
        }
    }, [network, getAlchemyProvider]);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                toast({
                    variant: "destructive",
                    title: "¡No se detectó ninguna billetera!",
                    description: "Por favor, instala una extensión de billetera como MetaMask.",
                });
                return;
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            await updateWalletState(accounts);
            toast({
                title: '¡Billetera Conectada!',
                description: `Conectado a ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: 'Falló la conexión',
                description: error.message,
            });
        }
    };

    const disconnectWallet = () => {
        setCurrentAccount(null);
        setNetwork(null);
        setBalance(null);
        setProvider(null);
        setAlchemyProvider(null);
        toast({
            title: 'Billetera Desconectada',
            description: 'Has desconectado tu billetera exitosamente.',
        });
    };

    const switchNetwork = async (chainId) => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    const chain = getNetworkByChainId(chainId);
                    if (chain) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: chain.chainId,
                                chainName: chain.chainName,
                                nativeCurrency: chain.nativeCurrency,
                                rpcUrls: chain.rpcUrls,
                                blockExplorerUrls: chain.blockExplorerUrls,
                            }],
                        });
                    }
                } catch (addError) {
                    console.error('Failed to add network', addError);
                    toast({
                        variant: "destructive",
                        title: 'Falló al agregar la red',
                        description: addError.message,
                    });
                }
            } else {
                console.error('Failed to switch network', switchError);
                toast({
                    variant: "destructive",
                    title: 'Falló al cambiar de red',
                    description: switchError.message,
                });
            }
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                updateWalletState(accounts);
            };

            const handleChainChanged = (_chainId) => {
                window.location.reload();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            const checkForConnectedAccount = async () => {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        await updateWalletState(accounts);
                    }
                } catch (error) {
                    console.error("No se pudo verificar la cuenta conectada", error);
                }
            };
            checkForConnectedAccount();

            return () => {
                if (window.ethereum.removeListener) {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    window.ethereum.removeListener('chainChanged', handleChainChanged);
                }
            };
        }
    }, [updateWalletState]);

    const value = useMemo(() => ({
        wallet: {
            address: currentAccount,
            network,
            balance,
        },
        provider,
        alchemyProvider,
        isConnected: !!currentAccount,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        supportedChains,
    }), [currentAccount, network, balance, provider, alchemyProvider, connectWallet, disconnectWallet, switchNetwork]);

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
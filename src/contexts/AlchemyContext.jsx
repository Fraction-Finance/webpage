import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';

const AlchemyContext = createContext();

export const useAlchemy = () => useContext(AlchemyContext);

export const AlchemyProvider = ({ children }) => {
    const [providers, setProviders] = useState({});

    const getProvider = useCallback((network) => {
        if (!network || !network.rpcUrls || network.rpcUrls.length === 0) {
            console.error("Invalid network object provided to getProvider");
            return null;
        }

        if (providers[network.chainId]) {
            return providers[network.chainId];
        }

        const newProvider = new ethers.JsonRpcProvider(network.rpcUrls[0]);
        setProviders(prev => ({ ...prev, [network.chainId]: newProvider }));
        return newProvider;
    }, [providers]);
    
    const value = useMemo(() => ({
      getProvider,
    }), [getProvider]);


    return (
        <AlchemyContext.Provider value={value}>
            {children}
        </AlchemyContext.Provider>
    );
};
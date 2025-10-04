import React, { createContext, useContext } from 'react';

const SwapContext = createContext();

export const useSwap = () => useContext(SwapContext);

export const SwapProvider = ({ children }) => {
  return <SwapContext.Provider value={null}>{children}</SwapContext.Provider>;
};
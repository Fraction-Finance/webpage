import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const ConnectWalletPrompt = () => {
  const { connectWallet } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center glass-effect p-8 rounded-2xl max-w-md mx-auto"
    >
      <img src="https://horizons-cdn.hostinger.com/f8b5c881-f6e8-4070-abdf-aa8b891ef867/0a29452e8c6f72d5834df2219229d2e0.png" alt="Connect Wallet Icon" className="mx-auto mb-6 h-24 w-24" />
      <h3 className="text-2xl font-semibold mb-4">Conecta tu Wallet</h3>
      <p className="text-gray-600 mb-6">Para interactuar, necesitas conectar tu wallet Web3.</p>
      <Button onClick={connectWallet} size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold text-lg glow-effect">
        <Wallet className="mr-2 h-5 w-5" /> Conectar Wallet
      </Button>
    </motion.div>
  );
};

export default ConnectWalletPrompt;
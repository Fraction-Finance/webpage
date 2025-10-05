import React, { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';
import { Zap, Shield, Loader2, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const DeFi = lazy(() => import('@/pages/markets/DeFi'));
const Funds = lazy(() => import('@/pages/markets/Funds'));
const PortfolioView = lazy(() => import('@/pages/markets/PortfolioView'));

const Markets = () => {
  const { isConnected } = useWallet();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };

  const tabs = [
    { value: 'portfolio', label: 'Portafolio', icon: LayoutDashboard, component: <PortfolioView /> },
    { value: 'defi', label: 'DeFi', icon: Zap, component: <DeFi /> },
    { value: 'funds', label: 'Fondos', icon: Shield, component: <Funds /> },
  ];

  const ActiveComponent = tabs.find(tab => tab.value === activeTab)?.component;

  return (
    <>
      <Helmet>
        <title>Mercados | Fraction Finance</title>
        <meta name="description" content="Explora, analiza e invierte en Activos Digitales, Activos del Mundo Real (RWA) y Activos DeFi." />
      </Helmet>
      <div className="pt-28 pb-12 bg-gray-50/50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="auth-prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center glass-effect p-8 rounded-2xl max-w-md mx-auto"
              >
                <h3 className="text-2xl font-semibold mb-4">Acceso Restringido</h3>
                <p className="text-gray-600 mb-6">Por favor, inicia sesión para acceder a los mercados.</p>
              </motion.div>
            ) : !isConnected ? (
              <motion.div
                key="wallet-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConnectWalletPrompt />
              </motion.div>
            ) : (
              <motion.div
                key="market-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-8">
                  <div className="flex items-center justify-start border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                      {tabs.map((tab) => (
                        <button
                          key={tab.value}
                          onClick={() => handleTabClick(tab.value)}
                          className={cn(
                            'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                            activeTab === tab.value
                              ? 'border-primary text-primary'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          )}
                        >
                          <tab.icon className={cn(
                            'mr-2 h-5 w-5',
                             activeTab === tab.value ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                          )} aria-hidden="true" />
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                        {ActiveComponent}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default Markets;
import React, { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';
import { Zap, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DeFi = lazy(() => import('@/pages/markets/DeFi'));
const Funds = lazy(() => import('@/pages/markets/Funds'));

const Markets = () => {
  const { isConnected } = useWallet();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('defi');

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };

  const tabs = [
    { value: 'defi', label: 'DeFi', icon: Zap, component: <DeFi category="Todos" /> },
    { value: 'funds', label: 'Fondos', icon: Shield, component: <Funds category="Todos" /> },
  ];

  const ActiveComponent = tabs.find(tab => tab.value === activeTab)?.component;

  return (
    <>
      <Helmet>
        <title>Mercados | Fraction Finance</title>
        <meta name="description" content="Explora, analiza e invierte en Activos Digitales, Activos del Mundo Real (RWA) y Activos DeFi." />
      </Helmet>
      <div className="pt-20 bg-gray-50/50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-10 mb-10 text-center"
          >
            <h1>
              <span className="gradient-text text-4xl md:text-5xl font-bold mb-2">Invierte en Activos Tokenizados</span>
            </h1>
            <p className="text-lg text-gray-600">En Fraction Finance unimos las finanzas tradicionales y DeFi, facilitando en inversiones digitales seguras y al alcance de todos.</p>
          </motion.div>

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
                className="flex flex-col md:flex-row gap-8"
              >
                <aside className="w-full md:w-64">
                  <nav className="flex flex-col gap-2">
                    {tabs.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleTabClick(value)}
                        className={cn(
                          "flex items-center p-3 rounded-lg text-base font-medium transition-all w-full text-left",
                          activeTab === value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-gray-700 hover:bg-gray-200/50"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </aside>
                <div className="flex-1">
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
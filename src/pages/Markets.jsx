
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';
import Swap from '@/pages/markets/Swap';
import DeFi from '@/pages/markets/DeFi';
import Funds from '@/pages/markets/Funds';
import RealWorld from '@/pages/markets/RealWorld';
import { RefreshCw, Zap, Shield, Gem, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Markets = () => {
  const { isConnected } = useWallet();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('swap');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [openCollapsible, setOpenCollapsible] = useState('');

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    const tab = tabs.find(t => t.value === tabValue);
    if (tab && tab.subCategories) {
      setActiveSubTab(tab.subCategories[tab.subCategories.length - 1].value);
      setOpenCollapsible(tabValue);
    } else {
      setActiveSubTab(null);
      setOpenCollapsible('');
    }
  };

  const handleSubTabClick = (subTabValue) => {
    setActiveSubTab(subTabValue);
  };

  const tabs = [
    { value: 'swap', label: 'Swap', icon: RefreshCw, component: <Swap /> },
    {
      value: 'defi',
      label: 'DeFi',
      icon: Zap,
      component: <DeFi category={activeSubTab} />,
      subCategories: [
        { value: 'Stablecoins', label: 'Stablecoins' },
        { value: 'Earn', label: 'Earn' },
        { value: 'LSTs', label: 'LSTs' },
        { value: 'Yield-bearing tokens', label: 'Yield-bearing tokens' },
        { value: 'Todos', label: 'Todos' },
      ],
    },
    {
      value: 'funds',
      label: 'Fondos',
      icon: Shield,
      component: <Funds category={activeSubTab} />,
      subCategories: [
        { value: 'Bonos y Renta Fija', label: 'Bonos y Renta Fija' },
        { value: 'Fondos de Inversión', label: 'Fondos de Inversión' },
        { value: 'Todos', label: 'Todos' },
      ],
    },
    {
      value: 'rwa',
      label: 'Mundo Real',
      icon: Gem,
      component: <RealWorld category={activeSubTab} />,
      subCategories: [
        { value: 'Bienes Raíces', label: 'Bienes Raíces' },
        { value: 'Infraestructura', label: 'Infraestructura' },
        { value: 'Todos', label: 'Todos' },
      ],
    },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gray-900">Nuestros Mercados</span>
            </h1>
            <p className="text-lg text-gray-600">
              Tu puerta de entrada a un universo de oportunidades de inversión.
            </p>
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
              <motion.div key="wallet-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConnectWalletPrompt />
              </motion.div>
            ) : (
              <motion.div key="market-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64">
                  <nav className="flex flex-col gap-2">
                    {tabs.map(({ value, label, icon: Icon, subCategories }) =>
                      subCategories ? (
                        <Collapsible key={value} open={openCollapsible === value} onOpenChange={() => setOpenCollapsible(openCollapsible === value ? '' : value)}>
                          <CollapsibleTrigger asChild>
                            <button
                              onClick={() => handleTabClick(value)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg text-base font-medium transition-all w-full text-left",
                                activeTab === value
                                  ? "bg-primary text-primary-foreground shadow-md"
                                  : "text-gray-700 hover:bg-gray-200/50"
                              )}
                            >
                              <div className="flex items-center">
                                <Icon className="mr-3 h-5 w-5" />
                                {label}
                              </div>
                              <ChevronRight className={cn("h-5 w-5 transition-transform", openCollapsible === value && "rotate-90")} />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 mt-1 space-y-1">
                            {subCategories.map(sub => (
                              <button
                                key={sub.value}
                                onClick={() => handleSubTabClick(sub.value)}
                                className={cn(
                                  "flex items-center p-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                                  activeSubTab === sub.value
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-200/50"
                                )}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
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
                      )
                    )}
                  </nav>
                </aside>
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + activeSubTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {ActiveComponent}
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

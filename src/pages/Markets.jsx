
import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useSettings } from '@/contexts/SettingsContext';
import { useWallet } from '@/contexts/WalletContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, LayoutGrid, Loader2, Zap } from 'lucide-react';

const Explore = lazy(() => import('@/pages/markets/Explore'));
const Funds = lazy(() => import('@/pages/markets/Funds'));
const DeFi = lazy(() => import('@/pages/markets/DeFi'));

const tabsConfig = [
  { value: 'explore', label: 'Todos', icon: LayoutGrid, component: <Explore /> },
  { value: 'funds', label: 'Fondos', icon: Briefcase, component: <Funds />, setting: 'show_rwa_invest' },
  { value: 'defi', label: 'DeFi', icon: Zap, component: <DeFi />, setting: 'show_defi_assets' },
];

const Markets = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const { settings, loading: settingsLoading } = useSettings();
  const { isConnected } = useWallet();

  const availableTabs = tabsConfig.filter(tab => {
    if (tab.setting && !settingsLoading && settings[tab.setting] === false) {
      return false;
    }
    if (tab.requiresWallet && !isConnected) {
      return false;
    }
    return true;
  });

  if (settingsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mercados de Inversión - Fraction Finance</title>
        <meta name="description" content="Explora una amplia gama de activos tokenizados, desde acciones y bienes raíces hasta innovadores productos DeFi. Invierte en el futuro de las finanzas." />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 mt-20">
            <TabsList className="grid grid-cols-3 bg-background/50 backdrop-blur-sm p-2 h-auto rounded-full">
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex-row gap-2 h-auto py-2 px-6 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            {availableTabs.map((tab) => (
              activeTab === tab.value && (
                <TabsContent key={tab.value} value={tab.value} asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2"
                  >
                    <Suspense fallback={
                      <div className="flex justify-center items-center h-96">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      </div>
                    }>
                      {tab.component}
                    </Suspense>
                  </motion.div>
                </TabsContent>
              )
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </>
  );
};

export default Markets;

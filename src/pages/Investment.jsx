import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AssetDetails from '@/components/portfolio/AssetDetails';
import { LayoutDashboard, History, PieChart } from 'lucide-react';

const Investment = () => {
  return (
    <>
      <Helmet>
        <title>Mi Portafolio | Fraction Finance</title>
        <meta name="description" content="Gestiona tu portafolio de activos tokenizados, sigue el rendimiento y descubre nuevas oportunidades de inversión en el panel de Fraction Finance." />
      </Helmet>
      <div className="pt-28 pb-12 bg-gray-50/50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between md:items-center mb-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Mi Portafolio</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Tu centro para gestionar y seguir tus activos digitales.
              </p>
            </div>
          </motion.div>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 max-w-lg mx-auto bg-gray-200/80 p-1.5 rounded-lg">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Panel
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Detalles
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Transacciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <PortfolioDashboard />
            </TabsContent>
            <TabsContent value="details">
              <AssetDetails />
            </TabsContent>
            <TabsContent value="history">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Investment;
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import DeFiAssetTable from '@/components/defi/DeFiAssetTable';

const DeFiPlatform = () => {
  const { isConnected, connectWallet } = useWallet();
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Mercado de Activos DeFi - Fraction Finance</title>
        <meta name="description" content="Accede a la plataforma independiente de Mercado de Activos DeFi de Fraction Finance. Gestiona tus LSTs, LP tokens, derivados y estrategias de yield." />
        <meta property="og:title" content="Mercado de Activos DeFi - Fraction Finance" />
        <meta property="og:description" content="Accede a la plataforma independiente de Mercado de Activos DeFi de Fraction Finance. Gestiona tus LSTs, LP tokens, derivados y estrategias de yield." />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-gray-900">Mercado de Activos DeFi</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Explora, gestiona e invierte en una amplia gama de activos del ecosistema de Finanzas Descentralizadas.
              </p>
            </motion.div>

            <div className="mt-12">
              {!user ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center glass-effect p-8 rounded-2xl max-w-md mx-auto"
                >
                  <h3 className="text-2xl font-semibold mb-4">Acceso Restringido</h3>
                  <p className="text-gray-600 mb-6">Por favor, inicia sesión para acceder a la plataforma DeFi.</p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold text-lg glow-effect">
                    <Link to="/auth/callback">Iniciar Sesión</Link>
                  </Button>
                </motion.div>
              ) : !isConnected ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center glass-effect p-8 rounded-2xl max-w-md mx-auto"
                >
                  <h3 className="text-2xl font-semibold mb-4">Conecta tu Billetera</h3>
                  <p className="text-gray-600 mb-6">Para interactuar con los activos DeFi, necesitas conectar tu billetera Web3.</p>
                  <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold text-lg glow-effect">
                    <Wallet className="mr-2 h-5 w-5" /> Conectar Billetera
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <DeFiAssetTable />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DeFiPlatform;
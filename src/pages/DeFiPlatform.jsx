import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, DollarSign, Shield, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DeFiPlatform = () => {
  const { isConnected, connectWallet } = useWallet();
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Plataforma DeFi - Fraction Finance</title>
        <meta name="description" content="Accede a la plataforma independiente de Activos DeFi de Fraction Finance. Gestiona tus LSTs, LP tokens, derivados y estrategias de yield." />
        <meta property="og:title" content="Plataforma DeFi - Fraction Finance" />
        <meta property="og:description" content="Accede a la plataforma independiente de Activos DeFi de Fraction Finance. Gestiona tus LSTs, LP tokens, derivados y estrategias de yield." />
      </Helmet>

      <div className="pt-20 min-h-screen flex flex-col justify-center items-center text-center">
        <section className="py-24 relative overflow-hidden mb-12 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-purple-600 mb-8">
                🚀 Tu Hub DeFi Personalizado
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gray-900">Bienvenido a la Plataforma DeFi</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Aquí podrás gestionar tus activos DeFi, explorar nuevas oportunidades de inversión y participar en el ecosistema descentralizado de Fraction Finance.
              </p>
              {!user ? (
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                  <Link to="/auth/callback">Iniciar Sesión para Acceder</Link>
                </Button>
              ) : (
                !isConnected && (
                  <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                    <Wallet className="mr-2 h-5 w-5" /> Conectar Billetera
                  </Button>
                )
              )}
              {user && isConnected && (
                <div className="mt-8">
                  <p className="text-lg text-gray-800">¡Tu billetera está conectada! Explora las funcionalidades DeFi.</p>
                  {/* Aquí irían los componentes de la plataforma DeFi */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center"
                    >
                      <Zap className="h-10 w-10 text-purple-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de LSTs</h3>
                      <p className="text-gray-700">Administra tus Liquid Staking Tokens.</p>
                      <Button variant="link" className="mt-4 text-purple-600">Ver LSTs</Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center"
                    >
                      <DollarSign className="h-10 w-10 text-purple-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Estrategias de Yield</h3>
                      <p className="text-gray-700">Descubre y participa en oportunidades de rendimiento.</p>
                      <Button variant="link" className="mt-4 text-purple-600">Explorar Yield</Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center"
                    >
                      <TrendingUp className="h-10 w-10 text-purple-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Derivados DeFi</h3>
                      <p className="text-gray-700">Accede a mercados de derivados descentralizados.</p>
                      <Button variant="link" className="mt-4 text-purple-600">Ver Derivados</Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DeFiPlatform;
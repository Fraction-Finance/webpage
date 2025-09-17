
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeFiAssets = () => {
  const features = [
    { icon: Zap, title: 'Tokenización de Yield', description: 'Convierte tus rendimientos futuros en tokens negociables para liquidez instantánea.' },
    { icon: DollarSign, title: 'Acceso a LSTs y LP Tokens', description: 'Invierte en Liquid Staking Tokens (LSTs) y Liquidity Provider (LP) tokens con facilidad.' },
    { icon: Shield, title: 'Derivados DeFi', description: 'Explora oportunidades en derivados descentralizados para estrategias de cobertura y apalancamiento.' },
    { icon: TrendingUp, title: 'Estrategias de Earn', description: 'Participa en diversas estrategias de "Earn" para maximizar tus retornos en el ecosistema DeFi.' }
  ];

  return (
    <>
      <Helmet>
        <title>Mercado de Activos DeFi - Plataforma de Finanzas Descentralizadas | Fraction Finance</title>
        <meta name="description" content="Explora el mundo de las finanzas descentralizadas con Fraction Finance. Accede a LSTs, LP tokens, derivados DeFi y estrategias de yield." />
        <meta property="og:title" content="Mercado de Activos DeFi - Plataforma de Finanzas Descentralizadas | Fraction Finance" />
        <meta property="og:description" content="Explora el mundo de las finanzas descentralizadas con Fraction Finance. Accede a LSTs, LP tokens, derivados DeFi y estrategias de yield." />
      </Helmet>

      <div className="pt-20">
        <section className="py-24 hero-pattern relative overflow-hidden mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-purple-600 mb-8">
                ⚡ Finanzas Descentralizadas
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gray-900">Mercado de Activos DeFi</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">Explora el mundo de las Finanzas Descentralizadas: tokeniza y administra tus activos DeFi con máxima seguridad y eficiencia.</p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                <Link to="/plataforma-defi">Explorar Mercado de Activos DeFi</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ventajas de Activos Descentralizados
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Descubre cómo los activos DeFi pueden transformar tu estrategia de inversión.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="glass-effect p-8 rounded-2xl hover:bg-gray-100 transition-all duration-300 group text-center">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 w-fit mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default DeFiAssets;

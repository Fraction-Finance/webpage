import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Globe, TrendingUp, Landmark, ShieldCheck, Shuffle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
const GlobalMarkets = () => {
  const features = [{
    icon: Globe,
    title: 'Acceso Unificado',
    description: 'Conéctate a una red global de bolsas y centros de liquidez desde una única plataforma.'
  }, {
    icon: TrendingUp,
    title: 'Liquidez Profunda',
    description: 'Accede a fondos de liquidez institucionales para una ejecución de órdenes eficiente y con bajo deslizamiento.'
  }, {
    icon: Landmark,
    title: 'Liquidación Transfronteriza',
    description: 'Liquida operaciones en múltiples jurisdicciones de forma instantánea y cumpliendo con la normativa.'
  }, {
    icon: ShieldCheck,
    title: 'Cumplimiento Regulatorio',
    description: 'Navega por los marcos regulatorios global es con nuestras herramientas de cumplimiento integradas.'
  }, {
    icon: Shuffle,
    title: 'Interoperabilidad de Activos',
    description: 'Opera activos tokenizados de diferentes blockchains y estándares sin problemas.'
  }, {
    icon: Clock,
    title: 'Operaciones 24/7',
    description: 'El mercado nunca duerme. Opera activos digitales en cualquier momento y lugar.'
  }];
  return <>
            <Helmet>
                <title>Mercado de Activos Digitales | Fraction Finance</title>
                <meta name="description" content="Nuestra plataforma transforma activos financieros tradicionales en oportunidades digitales, seguras y accesibles. Brindamos acceso a liquidez e inversión en mercados globales." />
                <meta property="og:title" content="Mercado de Activos Digitales" />
                <meta property="og:description" content="Nuestra plataforma transforma activos financieros tradicionales en oportunidades digitales, seguras y accesibles. Brindamos acceso a liquidez e inversión en mercados globales." />
            </Helmet>

            <div className="pt-20">
                <section className="py-24 hero-pattern relative overflow-hidden mb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
                            <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mb-8">
                                🌐 Conectando Capital
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                <span className="text-gray-900">Mercado de Activos Digitales</span>
                            </h1>
                            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">Nuestra plataforma convierte activos financieros tradicionales en oportunidades digitales seguras y accesibles.</p>
                            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                                <Link to="/plataforma">Acceder a la Plataforma de Trading</Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Un Mundo de Oportunidades
                            </h2>
                            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Descubre las ventajas del mercado de capitales e invierte de forma digital.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="glass-effect p-8 rounded-2xl hover:bg-gray-100 transition-all duration-300 group">
                                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {feature.description}
                                    </p>
                                </motion.div>)}
                        </div>
                    </div>
                </section>
            </div>
        </>;
};
export default GlobalMarkets;
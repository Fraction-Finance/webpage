import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Gem, Home, BarChart2, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
const RWAInvest = () => {
  const benefits = [{
    icon: Home,
    title: 'Propiedad Fraccionada',
    description: 'Posee una parte de activos de alto valor como bienes raíces y obras de arte sin necesidad de un gran capital.'
  }, {
    icon: TrendingUp,
    title: 'Liquidez Mejorada',
    description: 'Opera tus tokens respaldados por activos en mercados secundarios, convirtiendo activos ilíquidos en inversiones líquidas.'
  }, {
    icon: BarChart2,
    title: 'Diversificación de Portafolio',
    description: 'Diversifica fácilmente tu portafolio de inversiones accediendo a una amplia gama de activos del mundo real.'
  }, {
    icon: Lock,
    title: 'Transparencia y Seguridad',
    description: 'Aprovecha la blockchain para tener registros de propiedad transparentes y transacciones seguras e inmutables.'
  }];
  return <>
                <Helmet>
                    <title>Mercado RWA (Activos Reales) | Fraction Finance</title>
                    <meta name="description" content="Cerramos la brecha entre los activos tradicionales y el mundo digital, permitiéndote invertir en Activos del Mundo Real (RWA) tokenizados con facilidad y seguridad." />
                    <meta property="og:title" content="Mercado RWA (Activos Reales)" />
                    <meta property="og:description" content="Cerramos la brecha entre los activos tradicionales y el mundo digital, permitiéndote invertir en Activos del Mundo Real (RWA) tokenizados con facilidad y seguridad." />
                </Helmet>
    
                <div className="pt-20">
                    <section className="py-24 hero-pattern relative overflow-hidden">
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
                                <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-green-600 mb-8">
                                    <Gem className="inline-block h-4 w-4 mr-2" /> Activos del Mundo Real
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    <span className="text-gray-900">Mercado RWA<br />(Activos Reales)</span>
                                </h1>
                                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">Conectamos activos tradicionales con blockchain, permitiéndote invertir en Activos del Mundo Real (RWA) tokenizados de manera fácil, segura y transparente.</p>
                                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                                    <Link to="/mercado-rwa">
                                        Explora Oportunidades RWA
                                    </Link>
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
          }} className="text-center mb-16 pt-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">La Ventaja de los Activos Reales</h2>
                                <p className="text-xl text-gray-700 max-w-3xl mx-auto">Tokenizar activos del mundo real y desbloquea beneficios para los inversores.</p>
                            </motion.div>
    
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {benefits.map((benefit, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="glass-effect p-8 rounded-2xl hover:bg-gray-100 transition-all duration-300 group text-center">
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-teal-500/20 w-fit mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                                            <benefit.icon className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-700">
                                            {benefit.description}
                                        </p>
                                    </motion.div>)}
                            </div>
                        </div>
                    </section>
                </div>
            </>;
};
export default RWAInvest;
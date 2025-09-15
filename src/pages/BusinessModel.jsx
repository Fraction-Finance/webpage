import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Layers, Share2, Award, Banknote, ShieldCheck, Users, ArrowRight, Coins as HandCoins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BusinessModel = () => {
  const processSteps = [
    { icon: HandCoins, title: 'Inversión del Usuario', description: 'Los inversores transfieren capital a su cuenta segura de Fraction Finance.' },
    { icon: Layers, title: 'Adquisición de Activos', description: 'Compramos el activo financiero subyacente (acciones, ETFs) en el mercado chileno a través de corredores regulados.' },
    { icon: Share2, title: 'Emisión de Tokens', description: 'Emitimos tokens digitales en la blockchain, donde 1 token representa 1 fracción del activo subyacente.' },
    { icon: ShieldCheck, title: 'Custodia Regulada', description: 'Los activos subyacentes se mantienen en custodia segura y regulada, garantizando un respaldo real y auditable para cada token.' },
  ];

  const valuePropositions = [
    { icon: Award, title: 'Retornos para el Inversor', description: 'Recibe dividendos y benefíciate de la apreciación del activo, al igual que un inversor tradicional.' },
    { icon: Banknote, title: 'Flujos de Ingresos', description: 'Nuestros ingresos se generan a partir de comisiones justas por emisión, negociación y gestión de activos.' },
    { icon: Users, title: 'Ventajas de Mercado', description: 'Ofrecemos acceso fraccionado, mayor liquidez, inclusión financiera y transparencia en la cadena.' },
  ];

  const advantageCards = [
    { title: 'Acceso Fraccionado', description: 'Elimina las altas barreras de entrada, haciendo que los activos premium sean accesibles para todos.' },
    { title: 'Liquidez Mejorada', description: 'Nuestro mercado secundario 24/7 aporta liquidez a activos tradicionalmente ilíquidos.' },
    { title: 'Inclusión Financiera', description: 'Abriendo los mercados de capitales chilenos a una base de inversores global y diversa.' },
    { title: 'Transparencia On-Chain', description: 'Cada transacción se registra de forma inmutable, ofreciendo una auditabilidad sin precedentes.' },
  ];

  const ItemCard = ({ icon: Icon, title, description, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-effect p-6 rounded-2xl flex flex-col items-center text-center"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 w-fit mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>El Modelo de Negocio de Fraction Finance | Fraction Finance</title>
        <meta name="description" content="Abriendo nuevas fronteras en el mercado chileno al unir las finanzas tradicionales con el poder de la tecnología blockchain." />
      </Helmet>
      <div className="pt-20">
        <section className="py-24 hero-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mb-8">
                ⚙️ Cómo Operamos
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">El Modelo de Negocio de Fraction Finance</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Abriendo nuevas fronteras en el mercado chileno al unir las finanzas tradicionales con el poder de la tecnología blockchain.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Cómo Funciona la Tokenización</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">Nuestro proceso es transparente, seguro y cumple con las normativas, garantizando la confianza del inversor y la integridad del activo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <ItemCard key={index} {...step} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Creando Valor Mutuo</h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">Nuestro modelo está diseñado para generar valor de manera sostenible tanto para nuestros inversores como para nuestra plataforma.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {valuePropositions.map((prop, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="p-8 rounded-2xl bg-white border border-gray-200"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 w-fit mr-4">
                                    <prop.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{prop.title}</h3>
                            </div>
                            <p className="text-gray-700">{prop.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Ventajas Sobre los Mercados Tradicionales</h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">Aprovechamos la tecnología para superar las limitaciones de los sistemas de inversión convencionales.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {advantageCards.map((card, index) => (
                         <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-effect p-8 rounded-2xl"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                            <p className="text-gray-700">{card.description}</p>
                         </motion.div>
                    ))}
                </div>
            </div>
        </section>
      </div>
    </>
  );
};

export default BusinessModel;
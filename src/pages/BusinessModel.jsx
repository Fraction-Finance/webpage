import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Award, Banknote, Users, ArrowRight, Activity, Rocket, FileText, Landmark, TrendingUp, Briefcase, Factory } from 'lucide-react';

const BusinessModel = () => {
  const tokenizedAssets = [
    { icon: Rocket, name: 'Fondos Crypto' },
    { icon: FileText, name: 'Bonos' },
    { icon: Landmark, name: 'Deuda Privada' },
    { icon: TrendingUp, name: 'Renta Fija' },
    { icon: Briefcase, name: 'Capital de Trabajo' },
    { icon: Factory, name: 'Fondos de Inversión' }
  ];

  const valuePropositions = [
    { icon: Award, title: 'Retornos para el Inversor', description: 'Gana con la apreciación del activo y recibe dividendos. Además, obtén rendimientos extra a través de estrategias DeFi.' },
    { icon: Banknote, title: 'Flujos de Ingresos', description: 'Generamos ingresos a través de comisiones por tokenización, transacciones en el mercado secundario y servicios de gestión de activos DeFi.' },
    { icon: Users, title: 'Ventajas Competitivas', description: 'Ofrecemos acceso global 24/7, mayor liquidez, costos reducidos y una transparencia radical gracias a la blockchain.' },
  ];

  return (
    <>
      <Helmet>
        <title>Modelo de Negocio: Uniendo TradFi y DeFi | Fraction Finance</title>
        <meta name="description" content="Descubre cómo Fraction Finance fusiona las finanzas tradicionales (TradFi) con las finanzas descentralizadas (DeFi) para crear un ecosistema de inversión más eficiente, accesible y transparente." />
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
                ⚙️ TradFi + DeFi = El Futuro
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Nuestro Modelo de Negocio</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Construimos puentes entre las finanzas tradicionales y el universo DeFi para desbloquear un valor sin precedentes.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                Tokenización Innovadora de Activos
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-4xl mx-auto"
              >
                Tokenizamos instrumentos como fondos crypto, bonos, deuda privada, renta fija, capital de trabajo y fondos de inversión para crear un nuevo paradigma de inversión: más líquido, accesible y eficiente.
              </motion.p>
            </div>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {tokenizedAssets.map((asset, index) => (
                <motion.div 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group relative flex flex-col justify-center items-center text-center p-6 glass-effect rounded-2xl overflow-hidden aspect-square"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                      <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4 mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                          <asset.icon className="h-10 w-10 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground text-lg">{asset.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Creando un Ecosistema de Valor</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Nuestro modelo está diseñado para generar beneficios sostenibles para todos los participantes de la red.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {valuePropositions.map((prop, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="p-8 rounded-2xl bg-background/50 border border-border"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 w-fit mr-4">
                                    <prop.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{prop.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{prop.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            <span className="gradient-text">La Revolución de los Activos</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Al tokenizar activos, no solo los digitalizamos; los hacemos más inteligentes, accesibles y eficientes.</p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Acceso Democrático:</strong> Inversión fraccionada desde montos bajos.</span></li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Liquidez Global:</strong> Mercados secundarios que operan 24/7 sin fronteras.</span></li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Transparencia Inmutable:</strong> Propiedad y transacciones verificables en la blockchain.</span></li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center items-center"
                    >
                        <img class="rounded-3xl border-none w-full max-w-xl" alt="Illustration of physical assets being converted into digital tokens" src="https://horizons-cdn.hostinger.com/f8b5c881-f6e8-4070-abdf-aa8b891ef867/3684509d6da8b68b7fd32a3174f9ed11.png" />
                    </motion.div>
                </div>
            </div>
        </section>
      </div>
    </>
  );
};

export default BusinessModel;
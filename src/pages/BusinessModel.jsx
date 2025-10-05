import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Layers, Share2, Award, Banknote, ShieldCheck, Users, Zap, GitBranch, ArrowRight, Building, BarChart, Activity } from 'lucide-react';

const BusinessModel = () => {
  const businessPillars = [
    { 
      icon: Activity, 
      title: 'Mercado DeFi', 
      description: 'Accede a un ecosistema financiero abierto y global. Ofrecemos productos para generar rendimientos y optimizar tu capital.',
      items: ['Stablecoins', 'Earn', 'LSTs', 'Yield-bearing tokens']
    },
    { 
      icon: BarChart, 
      title: 'Tokenización de Fondos', 
      description: 'Digitalizamos fondos tradicionales para hacerlos más líquidos, accesibles y eficientes para el mercado global.',
      items: ['Bonos', 'Deuda', 'Renta Fija', 'Fondos de Inversión']
    },
  ];

  const valuePropositions = [
    { icon: Award, title: 'Retornos para el Inversor', description: 'Gana con la apreciación del activo y recibe dividendos. Además, obtén rendimientos extra a través de estrategias DeFi.' },
    { icon: Banknote, title: 'Flujos de Ingresos', description: 'Generamos ingresos a través de comisiones por tokenización, transacciones en el mercado secundario y servicios de gestión de activos DeFi.' },
    { icon: Users, title: 'Ventajas Competitivas', description: 'Ofrecemos acceso global 24/7, mayor liquidez, costos reducidos y una transparencia radical gracias a la blockchain.' },
  ];

  const PillarCard = ({ icon: Icon, title, description, items, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass-effect p-8 rounded-3xl flex flex-col text-left h-full border border-border/10"
    >
      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-5">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-5 flex-grow">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center text-muted-foreground">
            <ArrowRight className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

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
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Nuestros Pilares de Inversión</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Nos especializamos en dos áreas clave para ofrecer un abanico completo de oportunidades de inversión digital.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {businessPillars.map((pillar, index) => (
                <PillarCard {...pillar} index={index} />
              ))}
            </div>
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
                        <img class="rounded-3xl shadow-2xl w-full max-w-md" alt="Illustration of physical assets being converted into digital tokens" src="https://horizons-cdn.hostinger.com/f8b5c881-f6e8-4070-abdf-aa8b891ef867/3684509d6da8b68b7fd32a3174f9ed11.png" />
                    </motion.div>
                </div>
            </div>
        </section>
      </div>
    </>
  );
};

export default BusinessModel;
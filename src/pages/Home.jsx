import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Zap, Globe, TrendingUp, Users, Lock, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
const Home = () => {
  const {
    settings,
    homeContent,
    loading
  } = useSettings();
  const features = [{
    icon: Shield,
    title: 'Seguridad y Confianza',
    description: 'Seguridad de nivel bancario y protocolos avanzados. Verificación integrada y cumplimiento AML, además de reportes automatizados.'
  }, {
    icon: Zap,
    title: 'Tokenización Instantánea',
    description: 'Convierte activos físicos o financieros en tokens en minutos. Procesos totalmente automatizados, sin intermediarios.'
  }, {
    icon: Globe,
    title: 'Acceso Global',
    description: 'Operaciones 24/7 en múltiples mercados. Transacciones transfronterizas rápidas, seguras y eficientes.'
  }, {
    icon: TrendingUp,
    title: 'Liquidez para Activos Tradicionales',
    description: 'Fracciona activos tradicionales y más. Crea oportunidades de inversión accesibles para cualquier inversor.'
  }, {
    icon: Users,
    title: 'Red de Inversores',
    description: 'Conecta con inversores institucionales y minoristas de todo el mundo. Aumenta la visibilidad y demanda de tus activos tokenizados.'
  }, {
    icon: Lock,
    title: 'Innovación y Sostenibilidad',
    description: 'Foco en activos verdes y sostenibles. Impulsa la inversión responsable con impacto real en la economía y el medio ambiente.'
  }];
  const showAssetTypesSection = !loading && (settings.show_home_defi || settings.show_home_tradfi || settings.show_home_real_assets);
  const AssetCard = ({
    content,
    delay,
    icon: Icon
  }) => {
    if (!content) return null;
    const title = content.title === 'DeFi' ? 'Mercado DeFi' : content.title === 'Fondos' ? 'Fondos Tokenizados' : content.title;
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay
    }} className="group relative p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-transparent hover:border-primary/30 bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex flex-col items-center justify-center text-center h-full">
          <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
      </motion.div>;
  };
  return <>
      <Helmet>
        <title>Fraction Finance - Redefiniendo la manera de invertir.</title>
        <meta name="description" content="En Fraction Finance facilitamos las inversiones digitales." />
      </Helmet>

      <div className="overflow-x-hidden">
        <section className="relative flex items-center justify-center text-center py-24 md:py-32 lg:py-40">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            ease: 'easeOut'
          }} className="space-y-8 flex flex-col items-center justify-center">
              <motion.div initial={{
              scale: 0.8,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2,
              type: 'spring',
              stiffness: 200
            }} className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mt-16">
                🚀 El Futuro de las inversiones está Aquí
              </motion.div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mt-20">
                <span className="gradient-text">Redefiniendo la manera de invertir.</span>
                <br />
                <span className="text-foreground"> </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">"Facilitamos las inversiones en DeFi y fondos tokenizados."</p>
            </motion.div>
          </div>
        </section>

        {loading ? <div className="py-20 flex justify-center items-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div> : showAssetTypesSection && <section className="py-20 bg-white/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8
            }}>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 mt-12 tracking-tight">
                    <span className="gradient-text">Invierte en Activos Digitales</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">En Fraction Finance unimos las finanzas tradicionales y DeFi, facilitando en inversiones digitales seguras y al alcance de todos.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    {settings.show_home_defi && <AssetCard content={homeContent.defi} delay={0.2} icon={TrendingUp} />}
                    {settings.show_home_tradfi && <AssetCard content={homeContent.tradfi} delay={0.4} icon={Package} />}
                  </div>

                  <div className="glass-effect p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-foreground mb-2">📌 Nuestra Ventaja</h3>
                    <p className="text-muted-foreground leading-relaxed">Transformamos fondos tradicionales en activos tokenizados, brindando liquidez y acceso al mercado DeFi.</p>
                  </div>
                </motion.div>
                <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="flex justify-center items-center">
                  <img class="w-full max-w-xl" alt="Abstract visualization of digital asset tokenization" src="https://horizons-cdn.hostinger.com/f8b5c881-f6e8-4070-abdf-aa8b891ef867/3684509d6da8b68b7fd32a3174f9ed11.png" />
                </motion.div>
              </div>
            </div>
          </section>}

        <section className="py-20 bg-white/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                <span className="gradient-text">¿Por qué elegir Fraction Finance?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Construido para inversores individuales e institucionales, que exigen estándares de seguridad, cumplimiento y rendimiento.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="glass-effect p-8 rounded-2xl hover:bg-accent transition-all duration-300 group">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            scale: 0.95
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }} className="relative glass-effect rounded-2xl p-12 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="relative z-10 text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tokeniza con Fraction</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">La forma más simple y segura de convertir activos y fondos en tokens en la blockchain.</p>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">Emite activos, registra transacciones y gestiona tu cartera en una única plataforma.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/nosotros/contacto">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg pulse-glow">
                      Contacto
                    </Button>
                  </Link>
                  <Link to="/nosotros">
                    <Button variant="outline" size="lg" className="glass-effect border-border text-foreground hover:bg-accent px-8 py-4 rounded-full font-semibold text-lg">
                      Saber Más
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>;
};
export default Home;
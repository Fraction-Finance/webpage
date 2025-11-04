
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Zap, Globe, TrendingUp, Users, Lock, Loader2, ArrowRight, Activity, Landmark, FileText, Briefcase, Factory, Banknote, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
const Home = () => {
  const {
    settings,
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
  const tokenizedAssets = [{
    icon: Rocket,
    name: 'Fondos Crypto'
  }, {
    icon: FileText,
    name: 'Bonos'
  }, {
    icon: Landmark,
    name: 'Deuda Privada'
  }, {
    icon: TrendingUp,
    name: 'Renta Fija'
  }, {
    icon: Briefcase,
    name: 'Capital de Trabajo'
  }, {
    icon: Factory,
    name: 'Fondos de Inversión'
  }];
  const showAssetTypesSection = !loading && (settings.show_home_defi || settings.show_home_tradfi || settings.show_home_real_assets);
  return <>
      <Helmet>
        <title>Fraction Finance - Financiamiento e inversión en un solo lugar</title>
        <meta name="description" content="Transforma activos tradicionales en tokens basados en blockchain con seguridad de grado institucional. Accede a mercados de liquidez globales y desbloquea el futuro de los mercados de capitales." />
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
            }} className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mt-12">
                🚀 El Futuro de la Tokenización de Activos está Aquí
              </motion.div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mt-4">
                <span className="gradient-text">Financiamiento e inversión todo en un solo lugar</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">"Accede a nuevas oportunidades con fondos tokenizados"</p>
            </motion.div>
          </div>
        </section>

        {loading ? <div className="py-20 flex justify-center items-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div> : showAssetTypesSection && <section className="py-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    <span className="gradient-text">Invierte en Activos Digitales</span>
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Transformamos una amplia gama de instrumentos financieros en activos digitales líquidos, accesibles y eficientes.
                  </p>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
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
                  <img src="https://horizons-cdn.hostinger.com/f8b5c881-f6e8-4070-abdf-aa8b891ef867/copia-de-copia-de-engymint-1920-x-1080-px-5-Qk5OJ.png" className="w-full max-w-3xl rounded-3xl border-none" alt="Visualización abstracta de la tokenización de activos digitales" />
                </motion.div>
                 <motion.div initial={{
              opacity: 0,
              x: 50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8
            }}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {tokenizedAssets.map((asset, index) => <motion.div key={asset.name} initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }} className="group relative aspect-square flex flex-col justify-center items-center text-center p-4 glass-effect rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3 mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                                        <asset.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="font-semibold text-foreground">{asset.name}</p>
                                </div>
                            </motion.div>)}
                    </div>
                     <div className="mt-8 text-center">
                        <Link to="/mercados">
                            <Button size="lg" className="group">
                                Explorar Mercados <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
              </div>
            </div>
          </section>}

        <section className="py-20">
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
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Construido para inversores individuales e institucionales.</p>
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
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">La forma más simple y segura de convertir activos. Tokenización y gestión con total transparencia. Datos en tiempo real. Emite activos, registra transacciones y gestiona tu cartera en una única plataforma.</p>
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

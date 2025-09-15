import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Lock } from 'lucide-react';
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
    title: 'Red de Inversores Internacional',
    description: 'Conecta con inversores institucionales y minoristas de todo el mundo. Aumenta la visibilidad y demanda de tus activos tokenizados.'
  }, {
    icon: Lock,
    title: 'Innovación y Sostenibilidad',
    description: 'Foco en activos verdes y sostenibles. Impulsa la inversión responsable con impacto real en la economía y el medio ambiente.'
  }];
  const showAssetTypesSection = !loading && (settings.show_home_defi || settings.show_home_tradfi || settings.show_home_real_assets);
  return <>
      <Helmet>
        <title>Fraction Finance - Revolucionaria Plataforma de Tokenización de Activos Digitales</title>
        <meta name="description" content="Transforma activos tradicionales en tokens basados en blockchain con seguridad de grado institucional. Accede a mercados de liquidez globales y desbloquea el futuro de los mercados de capitales." />
      </Helmet>

      <div className="">
        <section className="relative flex items-center justify-center overflow-hidden text-center py-20 md:py-32 lg:py-40">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 50
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="space-y-8 flex flex-col items-center justify-center">
              <motion.div initial={{
              scale: 0.8
            }} animate={{
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary">
                🚀 El Futuro de la Tokenización de Activos está Aquí
              </motion.div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mt-4">
                <span className="gradient-text">Tokeniza Activos.</span>
                <br />
                <span className="text-gray-900">Desbloquea Liquidez.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">“Simplificamos tu acceso en la inversión de activos.”</p>
            </motion.div>
          </div>
        </section>

        {showAssetTypesSection && <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16 pt-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  <span className="gradient-text">🌐 Activos Tokenizados</span>
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">En Fraction Finance unimos las finanzas tradicionales, DeFi y activos del mundo real, facilitando en inversiones digitales seguras y al alcance de todos.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {settings.show_home_defi && <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="glass-effect p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Activos DeFi</h3>
                    <ul className="space-y-4 text-lg text-gray-700">
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Earn</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>LSTs</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>LP tokens</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Yield-bearing tokens</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Derivados DeFi</span></li>
                    </ul>
                  </motion.div>}
                
                {settings.show_home_tradfi && <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }} className="glass-effect p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Finanzas Tradicionales</h3>
                    <ul className="space-y-4 text-lg text-gray-700">
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Acciones y ETFs</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Bonos y Renta Fija</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Fondos de Inversión</span></li>
                    </ul>
                  </motion.div>}

                {settings.show_home_real_assets && <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.6
            }} className="glass-effect p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Activos Reales</h3>
                    <ul className="space-y-4 text-lg text-gray-700">
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Bienes Raíces</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Infraestructura</span></li>
                      <li className="flex items-start"><ArrowRight className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span>Materias Primas</span></li>
                    </ul>
                  </motion.div>}
              </div>

              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.8
          }} className="mt-16 text-center glass-effect p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📌 Nuestra Ventaja</h3>
                <p className="text-lg text-gray-700 leading-relaxed">Cada producto tokenizado de Fraction Finance está diseñado para ser fraccionable, accesible y cumplir con los marcos regulatorios, conectando el capital tradicional con las oportunidades digitales.</p>
              </motion.div>
            </div>
          </section>}

        <section className="py-20 bg-gray-50/50">
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
                <span className="gradient-text">¿Por qué elegir Fraction Finance?</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">Construido para inversores individuales e institucionales, así como para gestores de activos, que exigen altos estándares de seguridad, cumplimiento y rendimiento.</p>
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
                  <div className="p-3 rounded-xl bg-primary/20 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
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
          }} transition={{
            duration: 0.8
          }} className="relative glass-effect rounded-2xl p-12 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-primary/10 to-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-primary/10 to-primary/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold">Tokeniza con Fraction</h2>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto whitespace-pre-line">La forma más simple y segura de convertir activos y fondos en tokens en la blockchain.
Tokenización y gestión en cadena con total transparencia.
Datos en tiempo real e informes automatizados.
Emite activos, registra transacciones y gestiona tu cartera en una única plataforma.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/nosotros/contacto">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-full font-semibold text-lg pulse-glow">
                      Contacto
                    </Button>
                  </Link>
                  <Link to="/nosotros">
                    <Button variant="outline" size="lg" className="glass-effect border-gray-300 text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg">
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
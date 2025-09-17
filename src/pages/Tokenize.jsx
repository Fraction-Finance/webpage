
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Tokenize = () => {
  return (
    <>
      <Helmet>
        <title>Tokeniza Activos | Fraction Finance</title>
        <meta name="description" content="Digitaliza tus activos y desbloquea nueva liquidez con la plataforma de tokenización de Fraction Finance. Seguro, conforme a la normativa y eficiente." />
      </Helmet>
      <div className="pt-24 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 pt-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Lleva Tus Activos <span className="bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">a la Era Digital</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Nuestra solución integral de tokenización te permite convertir activos tradicionales en tokens digitales programables, líquidos y accesibles globalmente.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-effect p-8 rounded-xl text-center h-full">
                <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Digitalización de Activos</h3>
                <p className="text-gray-600">Representa activos del mundo real como bienes raíces, arte o capital privado como tokens únicos en la blockchain.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="glass-effect p-8 rounded-xl text-center h-full">
                <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Cumplimiento y Seguridad</h3>
                <p className="text-gray-600">Nuestra plataforma asegura que cada activo tokenizado cumpla con los estándares regulatorios con KYC/AML y marcos legales integrados.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="glass-effect p-8 rounded-xl text-center h-full">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Liquidez Mejorada</h3>
                <p className="text-gray-600">Desbloquea el valor de los activos ilíquidos permitiendo la propiedad fraccionada y el acceso a un grupo global de inversores.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative glass-effect rounded-2xl p-12 overflow-hidden text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Tokenizar?</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Ponte en contacto con nuestro equipo para discutir cómo podemos ayudarte a lanzar tu propia Oferta de Tokens de Valor (STO) y transformar tus activos.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link to="/nosotros/contacto">
                Contacta a Nuestro Equipo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Tokenize;

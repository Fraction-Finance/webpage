import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProductHero = () => {
  const { toast } = useToast();

  const handleFeatureClick = () => {
    toast({
      title: "🚧 ¡Esta característica aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mb-8">
            🏗️ Nivel Empresarial
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Infraestructura Completa</span>
            <br />
            <span className="text-gray-900">de Tokenización</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Todo lo que necesitas para tokenizar, gestionar y negociar activos digitales.
            Construido para instituciones, diseñado para escalar.
          </p>
          <Button 
            onClick={handleFeatureClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect"
          >
            Solicitar Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductHero;
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProductCta = () => {
  const { toast } = useToast();

  const handleFeatureClick = () => {
    toast({
      title: "🚧 ¡Esta característica aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            ¿Listo para <span className="text-primary">Construir el Futuro</span>?
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Agenda una demostración con nuestro equipo para ver cómo nuestra plataforma puede revolucionar tu estrategia de gestión de activos.
          </p>
          <Button 
            onClick={handleFeatureClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect"
          >
            Comenzar
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCta;
import React from 'react';
import { motion } from 'framer-motion';

const integrations = [
  { name: "Chainlink", logo: "🔗", description: "Fuentes de precios y datos externos" },
  { name: "Circle", logo: "⭕", description: "Integración con stablecoin USDC" },
  { name: "Fireblocks", logo: "🔥", description: "Soluciones de custodia institucional" },
  { name: "Chainalysis", logo: "📊", description: "Cumplimiento y gestión de riesgos" },
  { name: "DocuSign", logo: "📝", description: "Firma de documentos digitales" },
  { name: "Plaid", logo: "🏦", description: "Datos bancarios y financieros" }
];

const Integrations = () => {
  return (
    <section className="py-20 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Integraciones</span> Fluidas
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Conecta con los mejores servicios de su clase para mejorar tu flujo de trabajo de tokenización.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white/70 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {integration.logo}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-700">{integration.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
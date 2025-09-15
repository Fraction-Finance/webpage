import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Database, Shield, Zap, Globe, BarChart3 } from 'lucide-react';

const productFeatures = [
  {
    icon: Layers,
    title: "Tokenización Multi-Activo",
    description: "Soporte para bienes raíces, materias primas, valores y inversiones alternativas.",
    details: ["Propiedades Inmobiliarias", "Metales Preciosos", "Arte y Coleccionables", "Capital Privado"]
  },
  {
    icon: Database,
    title: "Infraestructura Blockchain",
    description: "Soluciones blockchain de nivel empresarial con compatibilidad entre cadenas.",
    details: ["Integración con Ethereum", "Soporte para Polygon", "Compatibilidad con BSC", "Cadenas Personalizadas"]
  },
  {
    icon: Shield,
    title: "Seguridad y Cumplimiento",
    description: "Seguridad de nivel bancario con cumplimiento regulatorio automatizado.",
    details: ["Billeteras Multi-Firma", "Integración KYC/AML", "Reportes Regulatorios", "Pistas de Auditoría"]
  },
  {
    icon: Zap,
    title: "Contratos Inteligentes",
    description: "Ejecución automatizada con lógica de negocio personalizable.",
    details: ["Distribución de Ingresos", "Derechos de Voto", "Restricciones de Transferencia", "Reglas de Cumplimiento"]
  },
  {
    icon: Globe,
    title: "Mercado Global",
    description: "Acceso a una red mundial de inversores y centros de negociación.",
    details: ["Negociación 24/7", "Multi-Moneda", "Transfronterizo", "Acceso Institucional"]
  },
  {
    icon: BarChart3,
    title: "Análisis y Reportes",
    description: "Información en tiempo real y un completo panel de informes.",
    details: ["Métricas de Rendimiento", "Análisis de Inversores", "Reportes de Cumplimiento", "Datos de Mercado"]
  }
];

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="glass-effect p-8 rounded-2xl"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-xl bg-blue-500/10 w-fit mr-4">
        <feature.icon className="h-8 w-8 text-[#0052cc]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
    </div>
    <p className="text-gray-700 mb-4">{feature.description}</p>
    <ul className="space-y-2">
      {feature.details.map((detail, detailIndex) => (
        <li key={detailIndex} className="flex items-center text-sm text-gray-600">
          <div className="w-1 h-1 rounded-full bg-[#0052cc] mr-3"></div>
          {detail}
        </li>
      ))}
    </ul>
  </motion.div>
);

const ProductFeatures = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Funcionalidades de la <span className="text-[#0052cc]">Plataforma Central</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Nuestra plataforma proporciona una base sólida y flexible para cualquier proyecto de tokenización.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;
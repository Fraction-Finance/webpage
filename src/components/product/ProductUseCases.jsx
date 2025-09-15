import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users } from 'lucide-react';

const ProductUseCases = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-effect p-8 rounded-2xl text-center lg:text-left">
              <div className="p-3 rounded-xl bg-blue-500/10 w-fit mb-4 mx-auto lg:mx-0">
                <Settings className="h-8 w-8 text-[#0052cc]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Para Gestores de Activos</h2>
              <p className="text-lg text-gray-700 mb-6">
                Crea nuevos productos de inversión, automatiza la administración de fondos y accede a un grupo global de inversores.
              </p>
              <ul className="space-y-3 text-left">
                {[
                  "Fracciona activos ilíquidos",
                  "Automatiza el cumplimiento y los informes",
                  "Reduce los gastos administrativos",
                  "Mejora la transparencia del portafolio"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0052cc] mr-4"></div>
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-effect p-8 rounded-2xl text-center lg:text-left">
              <div className="p-3 rounded-xl bg-blue-500/10 w-fit mb-4 mx-auto lg:mx-0">
                <Users className="h-8 w-8 text-[#0052cc]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Para Instituciones</h2>
              <p className="text-lg text-gray-700 mb-6">
                Emite y gestiona valores digitales con seguridad, cumplimiento y custodia de grado institucional.
              </p>
              <ul className="space-y-3 text-left">
                {[
                  "Digitaliza valores tradicionales",
                  "Mejora la eficiencia de la liquidación",
                  "Accede a nuevas fuentes de liquidez",
                  "Habilita activos programables"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0052cc] mr-4"></div>
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductUseCases;
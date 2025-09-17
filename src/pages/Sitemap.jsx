
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Sitemap = () => {
  const sitemapSections = [
    {
      title: 'Productos',
      links: [
        { name: 'Mercado de Activos Digitales', path: '/producto/mercados-globales' },
        { name: 'RWA (Activos Reales)', path: '/producto/invertir-rwa' },
        { name: 'Mercado de Activos DeFi', path: '/producto/mercado-activos-descentralizados' },
        { name: 'Tokenizar', path: '/tokenizar' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Nuestra Empresa', path: '/nosotros' },
        { name: 'Modelo de Negocio', path: '/nosotros/modelo-de-negocio' },
        { name: 'Ecosistema', path: '/ecosistema' },
        { name: 'Blog', path: '/nosotros/blog' },
        { name: 'Administración', path: '/administracion' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { name: 'Contacto', path: '/nosotros/contacto' },
        { name: 'Documentación', path: 'https://docs.fractionfinance.cl/', external: true },
        { name: 'Trabaja con Nosotros', path: '/nosotros/empleos' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Política de Privacidad', path: '/legal/politica-de-privacidad' },
        { name: 'Términos de Servicio', path: '/legal/terminos-de-servicio' },
        { name: 'Política de Cookies', path: '/legal/politica-de-cookies' },
        { name: 'Canal de Denuncias', path: '/legal/canal-de-denuncias' },
        { name: 'Canal de Reclamos', path: '/legal/canal-de-reclamos' },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Mapa del Sitio | Fraction Finance</title>
        <meta name="description" content="Encuentra rápidamente todas las páginas y secciones de Fraction Finance." />
      </Helmet>
      <div className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Map className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Mapa del Sitio</h1>
            <p className="text-lg text-gray-600">Navega fácilmente por todas las secciones de nuestra plataforma.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {sitemapSections.map((section, index) => (
              <Card key={index} className="glass-effect-custom">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.external ? (
                          <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary hover:underline transition-colors">
                            {link.name}
                          </a>
                        ) : (
                          <Link to={link.path} className="text-gray-700 hover:text-primary hover:underline transition-colors">
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;

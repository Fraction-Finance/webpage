import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, X } from 'lucide-react';
import Logo from '@/components/Logo';
const Footer = () => {
  const footerSections = [{
    title: 'Producto',
    links: [{
      name: 'Mercado de Activos Digitales',
      path: '/producto/mercados-globales'
    }, {
      name: 'RWA (Activos Reales)',
      path: '/producto/invertir-rwa'
    }, {
      name: 'Mercado de Activos DeFi',
      path: '/producto/mercado-activos-descentralizados'
    }, {
      name: 'Tokenizar',
      path: '/tokenizar'
    }]
  }, {
    title: 'Empresa',
    links: [{
      name: 'Nuestra Empresa',
      path: '/nosotros'
    }, {
      name: 'Modelo de Negocio',
      path: '/nosotros/modelo-de-negocio'
    }, {
      name: 'Ecosistema',
      path: '/ecosistema'
    }, {
      name: 'Blog',
      path: '/nosotros/blog'
    }, {
      name: 'Administración',
      path: '/administracion'
    }]
  }, {
    title: 'Soporte',
    links: [{
      name: 'Contacto',
      path: '/nosotros/contacto'
    }, {
      name: 'Documentación',
      path: 'https://docs.fractionfinance.cl/',
      external: true
    }, {
      name: 'Trabaja con Nosotros',
      path: '/nosotros/empleos'
    }, {
      name: 'Mapa del Sitio',
      path: '/mapa-del-sitio'
    }]
  }, {
    title: 'Legal',
    links: [{
      name: 'Política de Privacidad',
      path: '/legal/politica-de-privacidad'
    }, {
      name: 'Términos de Servicio',
      path: '/legal/terminos-de-servicio'
    }, {
      name: 'Política de Cookies',
      path: '/legal/politica-de-cookies'
    }, {
      name: 'Canal de Denuncias',
      path: '/legal/canal-de-denuncias'
    }, {
      name: 'Canal de Reclamos',
      path: '/legal/canal-de-reclamos'
    }]
  }];
  const socialLinks = [{
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/fractioncl'
  }, {
    icon: X,
    href: 'https://x.com/Fractioncl'
  }];
  return <footer className="glass-effect-dark text-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Logo className="h-12 w-auto mb-4" />
            <p className="text-gray-600 text-sm">Revolucionando la forma de invertir en Chile</p>
          </div>
          {footerSections.map(section => <div key={section.title}>
              <p className="font-semibold text-gray-900 tracking-wider uppercase">{section.title}</p>
              <ul className="mt-4 space-y-2">
                {section.links.map(link => <li key={link.name}>
                    {link.external ? <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">
                        {link.name}
                      </a> : <Link to={link.path} className="text-sm text-gray-600 hover:text-primary transition-colors">
                        {link.name}
                      </Link>}
                  </li>)}
              </ul>
            </div>)}
        </div>
        <div className="mt-12 border-t border-gray-200/50 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Fraction Finance. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {socialLinks.map((social, index) => <motion.a key={index} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{
            scale: 1.2,
            color: '#4F46E5'
          }} className="text-gray-500">
                <social.icon className="h-6 w-6" />
              </motion.a>)}
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
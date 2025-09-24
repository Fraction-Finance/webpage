
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ];

  const companyLinks = [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Modelo de Negocio', href: '/nosotros/modelo-de-negocio' },
    { name: 'Educación Financiera', href: '/nosotros/educacion-financiera' },
    { name: 'Blog', href: '/nosotros/blog' },
    { name: 'Empleos', href: '/nosotros/empleos' },
    { name: 'Contacto', href: '/nosotros/contacto' },
  ];

  const legalLinks = [
    { name: 'Política de Privacidad', href: '/legal/politica-de-privacidad' },
    { name: 'Términos de Servicio', href: '/legal/terminos-de-servicio' },
    { name: 'Política de Cookies', href: '/legal/politica-de-cookies' },
    { name: 'Canal de Denuncias', href: '/legal/canal-de-denuncias' },
    { name: 'Canal de Reclamos', href: '/legal/canal-de-reclamos' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'info@fractionfinance.cl', href: 'mailto:info@fractionfinance.cl' },
    { icon: Phone, text: '+56 2 2XXX XXXX', href: 'tel:+5622XXXXXXX' },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo y Redes Sociales */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="mb-4">
              <Logo className="h-16 w-auto" />
            </Link>
            <p className="text-sm text-center md:text-left mb-4">
              Revolucionando la inversión con activos tokenizados.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Empresa */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <a href={item.href} className="hover:text-primary transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Fraction Finance. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

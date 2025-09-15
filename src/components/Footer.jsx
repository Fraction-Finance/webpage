import React from 'react';
    import { Link } from 'react-router-dom';
    import { X, Linkedin, Github, Send, MessageSquare } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import Logo from '@/components/Logo';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const Footer = () => {
      const { toast } = useToast();
      const { user } = useAuth();
      
      const handleSocialClick = () => {
        toast({
          title: "🚧 ¡Esta característica aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
          duration: 4000
        });
      };

      return (
        <footer className="glass-effect border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Logo className="h-16 w-auto" />
                </div>
                <p className="text-gray-600 max-w-md mb-6">
                  Plataforma revolucionaria de tokenización de activos digitales para mercados de capitales. Transforma activos tradicionales en tokens basados en blockchain con seguridad de grado institucional.
                </p>
                <div className="flex space-x-4">
                  {[X, Linkedin, Github, Send, MessageSquare].map((Icon, index) => (
                    <button key={index} onClick={handleSocialClick} className="p-2 rounded-lg glass-effect hover:bg-gray-100 transition-colors duration-200">
                      <Icon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-900 font-semibold mb-4 block">Plataforma</span>
                <div className="space-y-3">
                  {[
                    { name: 'Producto', path: '/producto/mercados-globales' },
                    { name: 'Ecosistema', path: '/ecosistema' },
                    { name: 'Nosotros', path: '/nosotros' },
                    { name: 'Documentación', path: 'https://docs.fractionfinance.cl/', isExternal: true },
                    ...(user ? [{ name: 'Administración', path: '/administracion' }] : [])
                  ].map(item => (
                     item.isExternal ? (
                      <a key={item.name} href={item.path} target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        {item.name}
                      </a>
                    ) : (
                      <Link key={item.name} to={item.path} className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-900 font-semibold mb-4 block">Recursos</span>
                <div className="space-y-3">
                  {[
                    { name: 'Modelo de Negocio', path: '/nosotros/modelo-de-negocio' },
                    { name: 'Blog', path: '/nosotros/blog' },
                    { name: 'Trabaja con Nosotros', path: '/nosotros/empleos' },
                    { name: 'Soporte', path: '#' }
                  ].map(item => 
                    item.path !== '#' ? (
                      <Link key={item.name} to={item.path} className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">
                        {item.name}
                      </Link>
                    ) : (
                      <button key={item.name} onClick={handleSocialClick} className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 text-left">
                        {item.name}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">© 2025 Fraction Finance SpA. Todos los derechos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Política de Privacidad', 'Términos de Servicio', 'Política de Cookies'].map(item => (
                  <button key={item} onClick={handleSocialClick} className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
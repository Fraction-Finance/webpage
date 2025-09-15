
    import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { LayoutDashboard, DollarSign, Landmark, Shield, FileText, Users, Briefcase, Settings, Globe, HeartHandshake as Handshake } from 'lucide-react';
    import Logo from '@/components/Logo';

    const navLinks = [
      { to: 'panel', icon: LayoutDashboard, label: 'Panel' },
      { to: 'activos', icon: DollarSign, label: 'Activos Digitales' },
      { to: 'fondos', icon: Landmark, label: 'Fondos Tokenizados' },
      { to: 'stos', icon: Shield, label: 'STOs' },
      { to: 'blog', icon: FileText, label: 'Blog' },
      { to: 'usuarios', icon: Users, label: 'Usuarios' },
      { to: 'empleos', icon: Briefcase, label: 'Empleos' },
      { to: 'socios', icon: Handshake, label: 'Socios del Ecosistema' },
      { to: 'explorador', icon: Globe, label: 'Explorador de Red' },
      { to: 'configuracion', icon: Settings, label: 'Configuración' },
    ];

    const AdminSidebar = () => {
      const location = useLocation();
      const basePath = '/administracion/';

      return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
          <div className="h-20 flex items-center justify-center border-b border-gray-700">
            <Logo className="h-8" />
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={`${basePath}${to}`}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive || (to === 'blog' && location.pathname.includes('/blog/')) || (to === 'panel' && location.pathname.endsWith('/administracion')) || (to === 'panel' && location.pathname.endsWith('/administracion/'))
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
      );
    };

    export default AdminSidebar;
  
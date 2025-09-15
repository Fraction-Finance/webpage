
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Landmark, FileText, Rss, Users, Briefcase, Settings, Network, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const AdminSidebar = () => {
    const location = useLocation();

    const navLinks = [
        { to: 'panel', icon: LayoutDashboard, text: 'Panel' },
        { to: 'activos', icon: Package, text: 'Activos Digitales' },
        { to: 'fondos', icon: Landmark, text: 'Fondos Tokenizados' },
        { to: 'stos', icon: FileText, text: 'STOs' },
        { to: 'blog', icon: Rss, text: 'Blog' },
        { to: 'usuarios', icon: Users, text: 'Usuarios' },
        { to: 'empleos', icon: Briefcase, text: 'Empleos' },
        { to: 'socios', icon: Network, text: 'Socios del Ecosistema' },
        { to: 'politicas', icon: Shield, text: 'Políticas' },
        { to: 'configuracion', icon: Settings, text: 'Configuración' },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-800">
                <Logo className="h-12 w-auto" variant="white" />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map(({ to, icon: Icon, text }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )
                        }
                    >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;

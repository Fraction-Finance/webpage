import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Landmark, FileText, Rss, Users, Briefcase, Network, Shield, MessageSquare as MessageSquareWarning, Zap, Mail, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const AdminSidebar = () => {
    const navLinks = [
        { to: 'panel', icon: LayoutDashboard, text: 'Panel' },
        { to: 'activos', icon: Package, text: 'Activos Digitales' },
        { to: 'activos-defi', icon: Zap, text: 'Activos DeFi' },
        { to: 'fondos', icon: Landmark, text: 'Fondos Tokenizados' },
        { to: 'stos', icon: FileText, text: 'STOs' },
        { to: 'blog', icon: Rss, text: 'Blog' },
        { to: 'educacion', icon: GraduationCap, text: 'Educación' },
        { to: 'usuarios', icon: Users, text: 'Usuarios' },
        { to: 'mensajes', icon: Mail, text: 'Mensajes de Contacto' },
        { to: 'empleos', icon: Briefcase, text: 'Empleos' },
        { to: 'equipo', icon: Users, text: 'Equipo' },
        { to: 'socios', icon: Network, text: 'Socios del Ecosistema' },
        { to: 'politicas', icon: Shield, text: 'Políticas' },
        { to: 'reportes', icon: MessageSquareWarning, text: 'Denuncias y Reclamos' },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-800 flex-shrink-0">
                <Logo className="h-12 w-auto" variant="white" />
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="px-4 py-6 space-y-2">
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
            </div>
        </aside>
    );
};

export default AdminSidebar;
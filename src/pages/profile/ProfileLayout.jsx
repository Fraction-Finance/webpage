import React, { Suspense, lazy } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { User, FileText, Shield, Banknote, Loader2 } from 'lucide-react';

const AccountInformation = lazy(() => import('@/pages/profile/AccountInformation'));
const InvestmentProfile = lazy(() => import('@/pages/profile/InvestmentProfile'));
const KycKyb = lazy(() => import('@/pages/profile/KycKyb'));
const BankAccount = lazy(() => import('@/pages/profile/BankAccount'));

const ProfileLayout = () => {
  const navLinks = [
    { to: 'cuenta', icon: User, text: 'Información de Cuenta' },
    { to: 'perfil-inversion', icon: FileText, text: 'Perfil de Inversión' },
    { to: 'verificacion', icon: Shield, text: 'Verificación (KYC/KYB)' },
    { to: 'cuenta-bancaria', icon: Banknote, text: 'Cuenta Bancaria' },
  ];

  return (
    <>
      <Helmet>
        <title>Mi Perfil - Fraction Finance</title>
        <meta name="description" content="Gestiona tu información de perfil, perfil de inversión, verificación y cuenta bancaria en Fraction Finance." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  <span>{link.text}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="w-full md:w-3/4 lg:w-4/5">
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
              <Routes>
                <Route index element={<Navigate to="cuenta" replace />} />
                <Route path="cuenta" element={<AccountInformation />} />
                <Route path="perfil-inversion" element={<InvestmentProfile />} />
                <Route path="verificacion" element={<KycKyb />} />
                <Route path="cuenta-bancaria" element={<BankAccount />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
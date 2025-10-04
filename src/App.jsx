import React, { Suspense, lazy, memo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import DevelopmentNotice from '@/components/DevelopmentNotice';
import { useWallet } from '@/contexts/WalletContext';
import { MarketsProvider } from '@/contexts/MarketsContext';

const Home = lazy(() => import('@/pages/Home'));
const Ecosystem = lazy(() => import('@/pages/Ecosystem'));
const About = lazy(() => import('@/pages/About'));
const BusinessModel = lazy(() => import('@/pages/BusinessModel'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Contact = lazy(() => import('@/pages/Contact'));
const Careers = lazy(() => import('@/pages/Careers'));
const Tokenize = lazy(() => import('@/pages/Tokenize'));
const InvestDetail = lazy(() => import('@/pages/InvestDetail'));
const Investment = lazy(() => import('@/pages/Investment'));
const ProfileLayout = lazy(() => import('@/pages/profile/ProfileLayout'));
const Administration = lazy(() => import('@/pages/admin/Administration'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
const CookiePolicy = lazy(() => import('@/pages/legal/CookiePolicy'));
const ComplaintChannel = lazy(() => import('@/pages/legal/ComplaintChannel'));
const WhistleblowerChannel = lazy(() => import('@/pages/legal/WhistleblowerChannel'));
const Docs = lazy(() => import('@/pages/Docs'));
const Markets = lazy(() => import('@/pages/Markets'));
const FinancialEducation = lazy(() => import('@/pages/FinancialEducation'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const Waitlist = lazy(() => import('@/pages/Waitlist'));

const WalletProtectedRoute = ({ children }) => {
  const { isConnected } = useWallet();
  if (!isConnected) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

const MarketsLayout = () => (
  <MarketsProvider>
    <Routes>
      <Route index element={<Markets />} />
      <Route path=":stoId" element={<InvestDetail />} />
    </Routes>
  </MarketsProvider>
);

const MainLayout = memo(() => {
  const location = useLocation();
  const isMarketsPage = location.pathname.startsWith('/mercados');
  const isInvestmentPage = location.pathname.startsWith('/portafolio');

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/mercados/*" element={<ProtectedRoute><MarketsLayout /></ProtectedRoute>} />
            <Route path="/ecosistema" element={<Ecosystem />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/nosotros/modelo-de-negocio" element={<BusinessModel />} />
            <Route path="/nosotros/educacion-financiera" element={<FinancialEducation />} />
            <Route path="/nosotros/educacion-financiera/:slug" element={<ArticleDetail />} />
            <Route path="/nosotros/blog" element={<Blog />} />
            <Route path="/nosotros/blog/:slug" element={<BlogPost />} />
            <Route path="/nosotros/contacto" element={<Contact />} />
            <Route path="/nosotros/empleos" element={<Careers />} />
            <Route path="/tokenizar" element={<Tokenize />} />
            <Route path="/lista-de-espera" element={<Waitlist />} />
            <Route path="/portafolio" element={<WalletProtectedRoute><Investment /></WalletProtectedRoute>} />
            <Route path="/perfil/*" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>} />
            <Route path="/legal/politica-de-privacidad" element={<PrivacyPolicy />} />
            <Route path="/legal/terminos-de-servicio" element={<TermsOfService />} />
            <Route path="/legal/politica-de-cookies" element={<CookiePolicy />} />
            <Route path="/legal/canal-de-denuncias" element={<WhistleblowerChannel />} />
            <Route path="/legal/canal-de-reclamos" element={<ComplaintChannel />} />
            <Route path="/documentacion" element={<Docs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isMarketsPage && !isInvestmentPage && <Footer />}
    </>
  );
});

function App() {
  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>Fraction Finance - Plataforma de Tokenización de Activos Digitales</title>
        <meta name="description" content="Plataforma revolucionaria de tokenización de activos digitales para mercados de capitales. Transforma activos tradicionales en tokens basados en blockchain con seguridad y cumplimiento de grado institucional." />
        <meta property="og:title" content="Fraction Finance - Plataforma de Tokenización de Activos Digitales" />
        <meta property="og:description" content="Plataforma revolucionaria de tokenización de activos digitales para mercados de capitales. Transforma activos tradicionales en tokens basados en blockchain con seguridad y cumplimiento de grado institucional." />
      </Helmet>
      
      <Background />
      <DevelopmentNotice />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <Routes>
              <Route path="/*" element={<MainLayout />} />
              <Route path="/administracion/*" element={
                <ProtectedRoute>
                  <Administration />
                </ProtectedRoute>
              } />
            </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
import React, { Suspense, lazy } from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import Background from '@/components/Background';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import { useSettings } from '@/contexts/SettingsContext';
    import { Loader2 } from 'lucide-react';
    import GlobalMarkets from '@/pages/product/GlobalMarkets';
    import RWAInvest from '@/pages/product/RWAInvest';
    import DeFiAssets from '@/pages/product/DeFiAssets';
    import DeFiPlatform from '@/pages/DeFiPlatform'; // Import the new DeFiPlatform

    const Home = lazy(() => import('@/pages/Home'));
    const Ecosystem = lazy(() => import('@/pages/Ecosystem'));
    const About = lazy(() => import('@/pages/About'));
    const BusinessModel = lazy(() => import('@/pages/BusinessModel'));
    const Blog = lazy(() => import('@/pages/Blog'));
    const BlogPost = lazy(() => import('@/pages/BlogPost'));
    const Contact = lazy(() => import('@/pages/Contact'));
    const Careers = lazy(() => import('@/pages/Careers'));
    const Tokenize = lazy(() => import('@/pages/Tokenize'));
    const Platform = lazy(() => import('@/pages/Platform'));
    const InvestDetail = lazy(() => import('@/pages/InvestDetail'));
    const Investment = lazy(() => import('@/pages/Investment'));
    const ProfileLayout = lazy(() => import('@/pages/profile/ProfileLayout'));
    const AccountInformation = lazy(() => import('@/pages/profile/AccountInformation'));
    const InvestmentProfile = lazy(() => import('@/pages/profile/InvestmentProfile'));
    const KycKyb = lazy(() => import('@/pages/profile/KycKyb'));
    const BankAccount = lazy(() => import('@/pages/profile/BankAccount'));
    const RWAPlatform = lazy(() => import('@/pages/rwa/RWAPlatform'));
    const RWAAssetDetail = lazy(() => import('@/pages/rwa/RWAAssetDetail'));
    const Administration = lazy(() => import('@/pages/admin/Administration'));
    const AdminDashboard = lazy(() => import('@/pages/admin/components/AdminDashboard'));
    const ManageDigitalAssets = lazy(() => import('@/pages/admin/components/ManageDigitalAssets'));
    const ManageTokenizedVaults = lazy(() => import('@/pages/admin/components/ManageTokenizedVaults'));
    const VaultDetail = lazy(() => import('@/pages/admin/components/VaultDetail'));
    const ManageSTOs = lazy(() => import('@/pages/admin/components/ManageSTOs'));
    const BlogManager = lazy(() => import('@/pages/admin/components/BlogManager'));
    const BlogEditor = lazy(() => import('@/pages/admin/components/BlogEditor'));
    const UsersManager = lazy(() => import('@/pages/admin/components/UsersManager'));
    const ManageJobs = lazy(() => import('@/pages/admin/components/ManageJobs'));
    const PlatformSettings = lazy(() => import('@/pages/admin/components/PlatformSettings'));
    const Product = lazy(() => import('@/pages/Product'));
    const ManageEcosystemPartners = lazy(() => import('@/pages/admin/components/ManageEcosystemPartners'));
    const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

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

          <div className="relative z-10 flex flex-col min-h-screen">
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
              <Routes>
                <Route path="/*" element={<MainLayout />} />
                <Route path="/administracion/*" element={
                  <ProtectedRoute>
                    <Administration>
                      <Routes>
                        <Route path="/" element={<Navigate to="panel" replace />} />
                        <Route path="panel" element={<AdminDashboard />} />
                        <Route path="activos" element={<ManageDigitalAssets />} />
                        <Route path="fondos" element={<ManageTokenizedVaults />} />
                        <Route path="fondos/:vaultId" element={<VaultDetail />} />
                        <Route path="stos" element={<ManageSTOs />} />
                        <Route path="blog" element={<BlogManager />} />
                        <Route path="blog/nuevo" element={<BlogEditor />} />
                        <Route path="blog/editar/:postId" element={<BlogEditor />} />
                        <Route path="usuarios" element={<UsersManager />} />
                        <Route path="empleos" element={<ManageJobs />} />
                        <Route path="socios" element={<ManageEcosystemPartners />} />
                        <Route path="configuracion" element={<PlatformSettings />} />
                      </Routes>
                    </Administration>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </div>
      );
    }

    const MainLayout = () => {
      const { settings, loading } = useSettings();

      if (loading) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
      }

      return (
        <>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/mercado-rwa" element={<RWAPlatform />} />
              <Route path="/mercado-rwa/:stoId" element={<RWAAssetDetail />} />
              <Route path="/ecosistema" element={<Ecosystem />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/nosotros/modelo-de-negocio" element={<BusinessModel />} />
              <Route path="/nosotros/blog" element={<Blog />} />
              <Route path="/nosotros/blog/:slug" element={<BlogPost />} />
              <Route path="/nosotros/contacto" element={<Contact />} />
              <Route path="/nosotros/empleos" element={<Careers />} />
              <Route path="/tokenizar" element={<Tokenize />} />
              <Route path="/plataforma" element={<ProtectedRoute><Platform /></ProtectedRoute>} />
              <Route path="/plataforma/invertir/:stoId" element={<ProtectedRoute><InvestDetail /></ProtectedRoute>} />
              <Route path="/inversiones" element={<ProtectedRoute><Investment /></ProtectedRoute>} />
              <Route path="/producto/mercados-globales" element={<GlobalMarkets />} />
              <Route path="/producto/invertir-rwa" element={<RWAInvest />} />
              <Route path="/producto/activos-defi" element={<DeFiAssets />} />
              <Route path="/plataforma-defi" element={<ProtectedRoute><DeFiPlatform /></ProtectedRoute>} /> {/* New route for DeFi Platform */}
              <Route path="/producto" element={<Product />} />
              <Route path="/perfil" element={
                  <ProtectedRoute>
                      <ProfileLayout />
                  </ProtectedRoute>
              }>
                  <Route index element={<Navigate to="cuenta" replace />} />
                  <Route path="cuenta" element={<AccountInformation />} />
                  <Route path="perfil-inversion" element={<InvestmentProfile />} />
                  <Route path="verificacion" element={<KycKyb />} />
                  <Route path="cuenta-bancaria" element={<BankAccount />} />
              </Route>
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </>
      );
    };

    export default App;
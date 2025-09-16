import React, { Suspense, lazy } from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import Background from '@/components/Background';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import { useSettings } from '@/contexts/SettingsContext';
    import { Loader2 } from 'lucide-react';
    import DevelopmentNotice from '@/components/DevelopmentNotice';
    import { useWallet } from '@/contexts/WalletContext';

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
    const ManageDeFiAssets = lazy(() => import('@/pages/admin/components/ManageDeFiAssets'));
    const ManageTokenizedVaults = lazy(() => import('@/pages/admin/components/ManageTokenizedVaults'));
    const VaultDetail = lazy(() => import('@/pages/admin/components/VaultDetail'));
    const ManageSTOs = lazy(() => import('@/pages/admin/components/ManageSTOs'));
    const BlogManager = lazy(() => import('@/pages/admin/components/BlogManager'));
    const BlogEditor = lazy(() => import('@/pages/admin/components/BlogEditor'));
    const UsersManager = lazy(() => import('@/pages/admin/components/UsersManager'));
    const ManageJobs = lazy(() => import('@/pages/admin/components/ManageJobs'));
    const PlatformSettings = lazy(() => import('@/pages/admin/components/PlatformSettings'));
    const ManageEcosystemPartners = lazy(() => import('@/pages/admin/components/ManageEcosystemPartners'));
    const ManagePolicies = lazy(() => import('@/pages/admin/components/ManagePolicies'));
    const ManageReports = lazy(() => import('@/pages/admin/components/ManageReports'));
    const ManageTeam = lazy(() => import('@/pages/admin/components/ManageTeam'));
    const ManageContactSubmissions = lazy(() => import('@/pages/admin/components/ManageContactSubmissions'));
    const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
    const GlobalMarkets = lazy(() => import('@/pages/product/GlobalMarkets'));
    const RWAInvest = lazy(() => import('@/pages/product/RWAInvest'));
    const DeFiAssets = lazy(() => import('@/pages/product/DeFiAssets'));
    const DeFiPlatform = lazy(() => import('@/pages/DeFiPlatform'));
    const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
    const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
    const CookiePolicy = lazy(() => import('@/pages/legal/CookiePolicy'));
    const ComplaintChannel = lazy(() => import('@/pages/legal/ComplaintChannel'));
    const WhistleblowerChannel = lazy(() => import('@/pages/legal/WhistleblowerChannel'));
    const Sitemap = lazy(() => import('@/pages/Sitemap'));
    const Docs = lazy(() => import('@/pages/Docs'));
    const Product = lazy(() => import('@/pages/Product'));
    const Profile = lazy(() => import('@/pages/Profile'));


    const WalletProtectedRoute = ({ children }) => {
      const { isConnected } = useWallet();
      if (!isConnected) {
        return <Navigate to="/" replace />; 
      }
      return children;
    };

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
                      <Administration>
                        <Routes>
                          <Route path="/" element={<Navigate to="panel" replace />} />
                          <Route path="panel" element={<AdminDashboard />} />
                          <Route path="activos" element={<ManageDigitalAssets />} />
                          <Route path="activos-defi" element={<ManageDeFiAssets />} />
                          <Route path="fondos" element={<ManageTokenizedVaults />} />
                          <Route path="fondos/:vaultId" element={<VaultDetail />} />
                          <Route path="stos" element={<ManageSTOs />} />
                          <Route path="blog" element={<BlogManager />} />
                          <Route path="blog/nuevo" element={<BlogEditor />} />
                          <Route path="blog/editar/:postId" element={<BlogEditor />} />
                          <Route path="usuarios" element={<UsersManager />} />
                          <Route path="mensajes" element={<ManageContactSubmissions />} />
                          <Route path="empleos" element={<ManageJobs />} />
                          <Route path="equipo" element={<ManageTeam />} />
                          <Route path="socios" element={<ManageEcosystemPartners />} />
                          <Route path="configuracion" element={<PlatformSettings />} />
                          <Route path="politicas" element={<ManagePolicies />} />
                          <Route path="reportes" element={<ManageReports />} />
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
              <Route path="/mercado-rwa" element={<ProtectedRoute><RWAPlatform /></ProtectedRoute>} />
              <Route path="/mercado-rwa/:stoId" element={<ProtectedRoute><RWAAssetDetail /></ProtectedRoute>} />
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
              <Route path="/inversiones" element={<WalletProtectedRoute><Investment /></WalletProtectedRoute>} />
              {settings.show_global_markets && <Route path="/producto/mercados-globales" element={<GlobalMarkets />} />}
              {settings.show_rwa_invest && <Route path="/producto/invertir-rwa" element={<RWAInvest />} />}
              {settings.show_defi_assets && <Route path="/producto/mercado-activos-descentralizados" element={<DeFiAssets />} />}
              <Route path="/plataforma-defi" element={<ProtectedRoute><DeFiPlatform /></ProtectedRoute>} />
              <Route path="/legal/politica-de-privacidad" element={<PrivacyPolicy />} />
              <Route path="/legal/terminos-de-servicio" element={<TermsOfService />} />
              <Route path="/legal/politica-de-cookies" element={<CookiePolicy />} />
              <Route path="/legal/canal-de-denuncias" element={<WhistleblowerChannel />} />
              <Route path="/legal/canal-de-reclamos" element={<ComplaintChannel />} />
              <Route path="/mapa-del-sitio" element={<Sitemap />} />
              <Route path="/documentacion" element={<Docs />} />
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

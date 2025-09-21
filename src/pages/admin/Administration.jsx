import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { Loader2 } from 'lucide-react';

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
const ManageEducation = lazy(() => import('@/pages/admin/components/ManageEducation'));
const EducationEditor = lazy(() => import('@/pages/admin/components/EducationEditor'));

const Administration = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
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
          <Route path="educacion" element={<ManageEducation />} />
          <Route path="educacion/nuevo" element={<EducationEditor />} />
          <Route path="educacion/editar/:articleId" element={<EducationEditor />} />
          <Route path="usuarios" element={<UsersManager />} />
          <Route path="mensajes" element={<ManageContactSubmissions />} />
          <Route path="empleos" element={<ManageJobs />} />
          <Route path="equipo" element={<ManageTeam />} />
          <Route path="socios" element={<ManageEcosystemPartners />} />
          <Route path="configuracion" element={<PlatformSettings />} />
          <Route path="politicas" element={<ManagePolicies />} />
          <Route path="reportes" element={<ManageReports />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default Administration;
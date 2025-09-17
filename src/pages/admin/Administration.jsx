
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/pages/admin/components/AdminLayout';

const Administration = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>Administración | Fraction Finance</title>
        <meta name="description" content="Panel de administración para gestionar activos digitales, STOs, publicaciones de blog y configuración de la plataforma." />
      </Helmet>
      <AdminLayout>
        {children}
      </AdminLayout>
    </>
  );
};

export default Administration;

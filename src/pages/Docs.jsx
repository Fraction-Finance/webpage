import React from 'react';
import { Helmet } from 'react-helmet';
import DocsHero from '@/components/docs/DocsHero';
import QuickResources from '@/components/docs/QuickResources';
import DocCategories from '@/components/docs/DocCategories';
import ApiExplorer from '@/components/docs/ApiExplorer';
import DocsCta from '@/components/docs/DocsCta';

const Docs = () => {
  return (
    <>
      <Helmet>
        <title>Documentación - Recursos para Desarrolladores | Fraction Finance</title>
        <meta name="description" content="Documentación completa para nuestra plataforma de tokenización de activos digitales. Referencias de API, tutoriales, guías de seguridad y recursos de integración para desarrolladores." />
      </Helmet>

      <div className="pt-16">
        <DocsHero />
        <QuickResources />
        <DocCategories />
        <ApiExplorer />
        <DocsCta />
      </div>
    </>
  );
};

export default Docs;
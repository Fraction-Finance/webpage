import React from 'react';
import { Helmet } from 'react-helmet';
import ProductHero from '@/components/product/ProductHero';
import ProductFeatures from '@/components/product/ProductFeatures';
import Integrations from '@/components/product/Integrations';
import ProductUseCases from '@/components/product/ProductUseCases';
import ProductCta from '@/components/product/ProductCta';

const Product = () => {
  return (
    <>
      <Helmet>
        <title>Producto - Plataforma de Tokenización Avanzada | Finance</title>
        <meta name="description" content="Explora nuestra completa plataforma de tokenización de activos digitales. Soporte multi-activo, seguridad empresarial, contratos inteligentes y acceso a un mercado global." />
        <meta property="og:title" content="Producto - Plataforma de Tokenización Avanzada | Finance" />
        <meta property="og:description" content="Completa plataforma de tokenización de activos digitales. Soporte multi-activo, seguridad empresarial, contratos inteligentes y acceso a un mercado global." />
      </Helmet>
      <div className="pt-16">
        <ProductHero />
        <ProductFeatures />
        <Integrations />
        <ProductUseCases />
        <ProductCta />
      </div>
    </>
  );
};

export default Product;
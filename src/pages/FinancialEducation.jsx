import React, { useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { Loader2, GraduationCap } from 'lucide-react';
    import { useEducation } from '@/contexts/EducationContext';
    import ArticleCard from '@/components/education/ArticleCard';
    
    const FinancialEducation = () => {
      const { series, loading, error, fetchAllArticles } = useEducation();
    
      useEffect(() => {
        if (series.length === 0) {
          fetchAllArticles();
        }
      }, [fetchAllArticles, series.length]);
    
      return (
        <>
          <Helmet>
            <title>Educación Financiera - Fraction Finance</title>
            <meta name="description" content="Aprende sobre finanzas, inversión, tokenización y activos digitales con nuestra serie de artículos educativos. Empodérate para tomar mejores decisiones financieras." />
          </Helmet>
          <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
            <header className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 flex items-center justify-center gap-3">
                <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                <span className="gradient-text">Centro de Educación Financiera</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Tu guía para navegar el mundo de las finanzas modernas. Desde conceptos básicos hasta estrategias avanzadas de inversión en activos digitales.
              </p>
            </header>
    
            {loading && series.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
    
            {error && (
              <div className="text-center text-red-500">
                <p>Error al cargar el contenido educativo. Por favor, intenta de nuevo más tarde.</p>
              </div>
            )}
    
            {!loading && series.length > 0 && (
              <div className="space-y-16">
                {series.map((serie) => (
                  <section key={serie.title}>
                    <h2 className="text-3xl font-bold mb-8">{serie.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {serie.articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      );
    };
    
    export default FinancialEducation;
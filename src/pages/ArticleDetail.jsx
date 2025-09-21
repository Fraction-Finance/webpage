import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useEducation } from '@/contexts/EducationContext';
import QandA from '@/components/education/QandA';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FileText, Video, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
  const { slug } = useParams();
  const { getArticleBySlug, series, loading: seriesLoading } = useEducation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const data = await getArticleBySlug(slug);
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [slug, getArticleBySlug]);

  useEffect(() => {
    if (article && !seriesLoading && series.length > 0) {
      const allArticles = series.flatMap(s => s.articles);
      const articleIndex = allArticles.findIndex(a => a.id === article.id);
      if (articleIndex !== -1) {
        setPrevArticle(articleIndex > 0 ? allArticles[articleIndex - 1] : null);
        setNextArticle(articleIndex < allArticles.length - 1 ? allArticles[articleIndex + 1] : null);
      }
    }
  }, [article, series, seriesLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">Artículo no encontrado</h1>
        <p className="text-lg text-muted-foreground mb-8">El artículo que buscas no existe o ha sido movido.</p>
        <Button asChild>
          <Link to="/nosotros/educacion-financiera">Volver al centro de educación</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Fraction Finance</title>
        <meta name="description" content={article.introduction} />
      </Helmet>

      <div className="pt-28 pb-16 bg-gray-50/50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link to="/nosotros/educacion-financiera" className="text-primary hover:underline flex items-center mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a todos los artículos
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="gradient-text">{article.title}</span>
              </h1>
              <p className="text-xl text-muted-foreground">{article.introduction}</p>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 mb-12 ql-editor" dangerouslySetInnerHTML={{ __html: article.content }} />

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h2>
              <QandA questions={article.qna} />
            </div>

            {(article.pdf_url || article.video_url) && (
              <div className="glass-effect p-8 rounded-2xl mb-12">
                <h3 className="text-2xl font-bold mb-4">Recursos Adicionales</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.pdf_url && (
                    <Button asChild variant="outline" className="justify-start">
                      <a href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" /> PDF Descargable
                      </a>
                    </Button>
                  )}
                  {article.video_url && (
                    <Button asChild variant="outline" className="justify-start">
                      <a href={article.video_url} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" /> Video Explicativo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              {prevArticle ? (
                <Button asChild variant="outline">
                  <Link to={`/nosotros/educacion-financiera/${prevArticle.slug}`} className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Link>
                </Button>
              ) : <div />}
              {nextArticle ? (
                <Button asChild>
                  <Link to={`/nosotros/educacion-financiera/${nextArticle.slug}`} className="flex items-center">
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : <div />}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ArticleDetail;
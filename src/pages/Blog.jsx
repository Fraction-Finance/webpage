import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rss, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error al obtener las publicaciones del blog:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Nuestros Artículos y Noticias | Fraction Finance</title>
        <meta name="description" content="Explora los últimos desarrollos en tokenización, blockchain y finanzas globales." />
        <meta property="og:title" content="Nuestros Artículos y Noticias" />
        <meta property="og:description" content="Explora los últimos desarrollos en tokenización, blockchain y finanzas globales." />
      </Helmet>

      <div className="pt-24 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Rss className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Nuestros Artículos y Noticias</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Explora los últimos desarrollos en tokenización, blockchain y finanzas globales.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden glass-effect hover:shadow-xl transition-shadow duration-300">
                    {post.image_url && (
                      <Link to={`/nosotros/blog/${post.slug}`}>
                        <div className="h-48 overflow-hidden">
                          <img 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            src={post.image_url} />
                        </div>
                      </Link>
                    )}
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">{post.category || 'General'}</Badge>
                      <CardTitle className="text-xl font-bold leading-tight">
                        <Link to={`/nosotros/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div 
                        className="text-gray-600 line-clamp-3" 
                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.content.substring(0, 150) + '...' }} 
                      />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-4">
                        <div className="flex items-center text-sm text-gray-500 w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(post.published_at)}</span>
                            <div className="mx-2">·</div>
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{post.read_time || '5'} min de lectura</span>
                        </div>
                       
                         <Button asChild variant="link" className="p-0 h-auto text-primary">
                            <Link to={`/nosotros/blog/${post.slug}`}>
                                Leer más <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                ¡Aún no hay publicaciones!
              </h2>
              <p className="text-lg text-gray-700 max-w-xl mb-6">
                Estamos preparando nuestros primeros artículos. ¡Vuelve pronto para encontrar contenido valioso sobre el futuro de las finanzas y los activos tokenizados!
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Blog;
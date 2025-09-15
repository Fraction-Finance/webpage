import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Calendar, Clock, Share2, ArrowLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        setShareUrl(window.location.href);

        const fetchPost = async () => {
            setLoading(true);
            const { data: postData, error: postError } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (postError || !postData) {
                console.error('Error al obtener la publicación:', postError);
                navigate('/nosotros/blog');
                return;
            }

            setPost(postData);
            setLoading(false);
        };

        fetchPost();
    }, [slug, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!post) {
      return null;
    }

    return (
        <>
            <Helmet>
                <title>{post.title} | Fraction Finance Blog</title>
                <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
                <meta property="og:image" content={post.image_url} />
                <meta property="og:type" content="article" />
            </Helmet>

            <div className="pt-24 pb-12">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button variant="ghost" onClick={() => navigate('/nosotros/blog')} className="mb-8 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
                        </Button>
                    </motion.div>
                    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <header className="mb-8">
                            <Badge variant="secondary" className="mb-4">{post.category || 'General'}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                            <div className="flex flex-wrap items-center text-gray-500 text-sm gap-x-6 gap-y-2">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{post.read_time || 5} min de lectura</span>
                                </div>
                            </div>
                        </header>
                        
                        {post.image_url && (
                            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                                <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover" />
                            </div>
                        )}

                        <div 
                            className="prose lg:prose-xl max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <footer className="mt-12 pt-8 border-t">
                            <div className="flex items-center justify-center gap-4">
                                <Share2 className="h-6 w-6 text-gray-600"/>
                                <span className="font-semibold text-gray-700">Compartir:</span>
                                <TwitterShareButton url={shareUrl} title={post.title}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <LinkedinShareButton url={shareUrl} title={post.title} summary={post.excerpt}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                                <FacebookShareButton url={shareUrl} quote={post.title}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                            </div>
                        </footer>

                    </motion.article>
                </main>
            </div>
        </>
    );
};

export default BlogPost;
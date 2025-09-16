import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('legal_policies')
                .select('title, content')
                .eq('policy_type', 'privacy_policy')
                .single();

            if (error) {
                console.error('Error fetching privacy policy:', error);
            } else {
                setPolicy(data);
            }
            setLoading(false);
        };

        fetchPolicy();
    }, []);

    return (
        <>
            <Helmet>
                <title>{policy?.title || 'Política de Privacidad'} | Fraction Finance</title>
                <meta name="description" content={`Lee nuestra ${policy?.title || 'Política de Privacidad'}.`} />
            </Helmet>
            <div className="pt-24 sm:pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : policy ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="prose lg:prose-xl max-w-none glass-effect-custom p-8 rounded-lg"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">{policy.title}</h1>
                            <div className="text-justify" dangerouslySetInnerHTML={{ __html: policy.content }} />
                        </motion.div>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold">Política no encontrada</h1>
                            <p className="mt-4 text-lg text-gray-600">No se pudo cargar el contenido de la política de privacidad.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
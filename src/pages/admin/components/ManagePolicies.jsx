
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';

const PolicyEditor = ({ policyType, title }) => {
    const [content, setContent] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const fetchPolicy = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('legal_policies')
            .select('content')
            .eq('policy_type', policyType)
            .single();

        if (error) {
            toast({ title: 'Error al cargar la política', description: error.message, variant: 'destructive' });
        } else if (data) {
            setContent(data.content || '');
            setInitialContent(data.content || '');
        }
        setLoading(false);
    }, [policyType, toast]);

    useEffect(() => {
        fetchPolicy();
    }, [fetchPolicy]);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('legal_policies')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('policy_type', policyType);

        if (error) {
            toast({ title: 'Error al guardar la política', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '¡Éxito!', description: `${title} guardada correctamente.` });
            setInitialContent(content);
        }
        setSaving(false);
    };

    const hasChanged = content !== initialContent;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Edita el contenido de la {title.toLowerCase()}.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link'],
                                ['clean']
                            ],
                        }}
                        className="bg-white"
                    />
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={!hasChanged || saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar
                </Button>
            </CardFooter>
        </Card>
    );
};

const ManagePolicies = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="space-y-8"
        >
            <PolicyEditor policyType="privacy_policy" title="Política de Privacidad" />
            <PolicyEditor policyType="terms_of_service" title="Términos de Servicio" />
            <PolicyEditor policyType="cookie_policy" title="Política de Cookies" />
        </motion.div>
    );
};

export default ManagePolicies;

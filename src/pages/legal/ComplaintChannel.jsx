import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Send } from 'lucide-react';

const ComplaintChannel = () => {
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('reports').insert({
      report_type: 'complaint',
      name: isAnonymous ? null : formData.name,
      email: isAnonymous ? null : formData.email,
      details: formData.details,
      is_anonymous: isAnonymous,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Tu reclamo ha sido enviado. Gracias por tus comentarios.' });
      setFormData({ name: '', email: '', details: '' });
      setIsAnonymous(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Canal de Reclamos | Fraction Finance</title>
        <meta name="description" content="Envía tus reclamos y sugerencias para ayudarnos a mejorar." />
      </Helmet>
      <div className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Canal de Reclamos</h1>
            <p className="text-lg text-gray-600">Tu opinión es importante. Utiliza este canal para enviar reclamos o sugerencias sobre nuestros servicios.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect-custom p-8 rounded-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="anonymous">Deseo enviar este reclamo de forma anónima</Label>
              </div>
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required={!isAnonymous} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required={!isAnonymous} />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="details">Detalles del Reclamo</Label>
                <Textarea id="details" rows={6} value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Reclamo
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ComplaintChannel;
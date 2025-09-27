
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, PartyPopper, Rocket } from 'lucide-react';

const Waitlist = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('waitlist_submissions')
      .insert([{ name, email }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.code === '23505' ? "Este correo electrónico ya está en nuestra lista de espera." : "Hubo un problema. Por favor, inténtalo de nuevo.",
      });
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Lista de Espera - Fraction Finance</title>
        <meta name="description" content="Únete a la lista de espera de Fraction Finance para ser el primero en saber sobre nuestro lanzamiento y acceder a oportunidades de inversión exclusivas." />
      </Helmet>
      <div className="container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="glass-effect-deep">
            <CardHeader className="text-center">
              {submitted ? (
                <PartyPopper className="mx-auto h-12 w-12 text-primary" />
              ) : (
                <Rocket className="mx-auto h-12 w-12 text-primary" />
              )}
              <CardTitle className="text-3xl font-bold mt-4">
                {submitted ? "¡Estás en la lista!" : "Únete a la Lista de Espera"}
              </CardTitle>
              <CardDescription>
                {submitted 
                  ? "Gracias por tu interés. Te notificaremos tan pronto como lancemos la plataforma. ¡Prepárate para revolucionar tus inversiones!"
                  : "Sé el primero en enterarte de nuestro lanzamiento y obtén acceso anticipado a oportunidades de inversión únicas. ¡El futuro de las finanzas te espera!"
                }
              </CardDescription>
            </CardHeader>
            {!submitted && (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "¡Quiero ser el primero!"
                    )}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Waitlist;

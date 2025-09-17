import React, { useState } from 'react';
import { Mail, Key, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import GoogleIcon from '@/components/icons/GoogleIcon';

const AuthForm = ({ mode, onAuthSuccess }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let error;
    if (mode === 'signin') {
      ({ error } = await signIn(email, password));
    } else {
      ({ error } = await signUp(email, password, fullName));
    }
    if (!error) {
      onAuthSuccess();
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input id="name-signup" placeholder="Nombre Completo" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input id={`email-${mode}`} type="email" placeholder="Correo Electrónico" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input id={`password-${mode}`} type="password" placeholder="Contraseña" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continuar con
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={loading}>
        <GoogleIcon className="mr-2 h-5 w-5" />
        {mode === 'signin' ? 'Iniciar Sesión con Google' : 'Registrarse con Google'}
      </Button>
    </>
  );
};

export default AuthForm;

import React, { useState } from 'react';
import { Mail, Key, User, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import GoogleIcon from '@/components/icons/GoogleIcon';

const AuthModal = () => {
  const { signIn, signUp, signInWithGoogle, user, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (!error) {
      setOpen(false);
      setEmail('');
      setPassword('');
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await signUp(email, password, fullName);
    if (!error) {
      setOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
    }
  };

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
    setOpen(false);
  };
  
  if (user) {
    return (
       <Button onClick={signOut} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 glow-effect">
         Cerrar Sesión
       </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 rounded-full font-medium transition-all duration-200 glow-effect">
          Iniciar Sesión
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="signin" className="w-full">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold gradient-text mb-2">
              ¡Bienvenido!
            </DialogTitle>
            <DialogDescription className="text-center">
              Inicia sesión o crea una cuenta para comenzar.
            </DialogDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
          </DialogHeader>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email-signin" type="email" placeholder="Correo Electrónico" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="password-signin" type="password" placeholder="Contraseña" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
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
            <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Iniciar Sesión con Google
            </Button>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="name-signup" placeholder="Nombre Completo" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required/>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email-signup" type="email" placeholder="Correo Electrónico" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="password-signup" type="password" placeholder="Contraseña" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <Button type="submit" className="w-full">
                Crear Cuenta
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
            <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Registrarse con Google
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

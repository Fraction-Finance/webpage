import React, { useState } from 'react';
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
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AuthForm from '@/components/AuthForm';

const AuthModal = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleAuthSuccess = () => {
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

          <TabsContent value="signin" className="mt-4">
            <AuthForm mode="signin" onAuthSuccess={handleAuthSuccess} />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <AuthForm mode="signup" onAuthSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
import React, { useState, useRef } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import { User, FileText, ShieldCheck, Loader2, Landmark, TrendingUp, BarChart, Zap, Shield, Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ProfileLayout = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      
      await refreshProfile();
      toast({
        title: '¡Avatar actualizado!',
        description: 'Tu foto de perfil ha sido cambiada con éxito.',
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al subir el avatar',
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const getProfileBadge = (profileResult) => {
    switch (profileResult) {
      case 'Conservador':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Shield className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Moderado':
        return <Badge variant="default" className="bg-green-100 text-green-800"><BarChart className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Dinámico':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><TrendingUp className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Agresivo':
        return <Badge variant="default" className="bg-red-100 text-red-800"><Zap className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      default:
        return (
            <Link to="/perfil/perfil-inversion">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Completar Test
                </Badge>
            </Link>
        );
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/perfil/perfil-inversion':
        return 'Perfil de Inversión';
      case '/perfil/verificacion':
        return profile?.account_type === 'institutional' ? 'Verificación KYB' : 'Verificación KYC';
      case '/perfil/cuenta-bancaria':
        return 'Cuenta para Retiros';
      case '/perfil/cuenta':
      default:
        return 'Información de Cuenta';
    }
  };
  const navItems = [{
    href: '/perfil/cuenta',
    icon: User,
    label: 'Información de Cuenta'
  }, {
    href: '/perfil/perfil-inversion',
    icon: FileText,
    label: 'Perfil de Inversión'
  }, {
    href: '/perfil/verificacion',
    icon: ShieldCheck,
    label: profile?.account_type === 'institutional' ? 'Verificación KYB' : 'Verificación KYC'
  }, {
    href: '/perfil/cuenta-bancaria',
    icon: Landmark,
    label: 'Cuenta para Retiros'
  }];
  const getInitials = name => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>;
  }
  return <>
          <Helmet>
            <title>{getPageTitle()} | Fraction Finance</title>
            <meta name="description" content={`Administra tu ${getPageTitle().toLowerCase()} en Fraction Finance.`} />
          </Helmet>
          <div className="pt-24 pb-12">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="gradient-text">Perfil de Usuario</span>
                </h1>
                <p className="text-xl text-gray-700">Administre los detalles de su cuenta, su perfil de inversión y su estado de verificación.</p>
              </motion.div>
              
              <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                <aside className="lg:col-span-3 mb-8 lg:mb-0">
                  <Card className="p-4 glass-effect">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-white shadow-lg">
                          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                          <AvatarFallback className="text-3xl bg-gray-200">{getInitials(profile?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div 
                          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          {uploading ? (
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          ) : (
                            <Camera className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          onChange={handleAvatarUpload}
                          className="hidden"
                          accept="image/png, image/jpeg"
                          disabled={uploading}
                        />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">{profile?.full_name || 'Usuario'}</h2>
                      <p className="text-sm text-gray-500 break-all mb-2">{user?.email}</p>
                      <div className="mt-2 text-center">
                          <Label className="text-xs text-gray-500 font-medium">Perfil de Inversionista</Label>
                          <div className="mt-1">
                            {getProfileBadge(profile?.investor_profile_result)}
                          </div>
                      </div>
                    </div>
                    <nav className="space-y-1">
                      {navItems.map(item => <NavLink key={item.label} to={item.href} end={item.href === '/perfil'} className={({
                  isActive
                }) => cn('group rounded-md px-3 py-3 flex items-center text-sm font-medium transition-colors duration-200', isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100')}>
                          <item.icon className={cn('mr-3 flex-shrink-0 h-5 w-5', location.pathname === item.href ? 'text-primary' : 'text-gray-500 group-hover:text-gray-600')} aria-hidden="true" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>)}
                    </nav>
                  </Card>
                </aside>

                <div className="lg:col-span-9">
                  <motion.div key={location.pathname} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }}>
                    <Outlet />
                  </motion.div>
                </div>
              </div>
            </main>
          </div>
        </>;
};
export default ProfileLayout;
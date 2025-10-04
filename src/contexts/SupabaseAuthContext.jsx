import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    
    const AuthContext = createContext(undefined);
    
    export const AuthProvider = ({ children }) => {
      const { toast } = useToast();
    
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [session, setSession] = useState(null);
      const [loading, setLoading] = useState(true);
    
      const fetchProfile = useCallback(async (userId) => {
        if (!userId) return null;
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('id', userId)
            .single();
    
          if (error && status !== 406) {
            throw error;
          }
          return data;
        } catch (error) {
          console.error('Error al obtener el perfil:', error);
          return null;
        }
      }, []);
    
      const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
    
        if (error) {
          toast({
            variant: "destructive",
            title: "Falló el cierre de sesión",
            description: error.message || "Algo salió mal",
          });
        }
    
        return { error };
      }, [toast]);

      useEffect(() => {
        setLoading(true);
        const getInitialSession = async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
              const userProfile = await fetchProfile(currentUser.id);
              setProfile(userProfile);
            }
          } catch (error) {
            console.error("Error getting initial session:", error);
            if (error.message.includes("Invalid Refresh Token")) {
              await signOut();
            }
          } finally {
            setLoading(false);
          }
        };
    
        getInitialSession();
    
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            const newCurrentUser = session?.user ?? null;
            setUser(newCurrentUser);
    
            if (newCurrentUser) {
              const userProfile = await fetchProfile(newCurrentUser.id);
              setProfile(userProfile);
            } else {
              setProfile(null);
            }
    
            if (event === 'SIGNED_IN' && session) {
              toast({
                title: '¡Has iniciado sesión correctamente!',
                description: `¡Bienvenido de nuevo, ${session.user.user_metadata.full_name || session.user.email}!`,
              });
            }
            if (event === 'SIGNED_OUT') {
               toast({
                title: '¡Sesión cerrada!',
                description: 'Has cerrado sesión correctamente.',
              });
            }
            if (event === 'TOKEN_REFRESHED' && !session) {
              await signOut();
            }
          }
        );
    
        return () => subscription.unsubscribe();
      }, [fetchProfile, toast, signOut]);
    
      const refreshProfile = useCallback(async () => {
        if (user) {
          const userProfile = await fetchProfile(user.id);
          setProfile(userProfile);
        }
      }, [user, fetchProfile]);
    
      const signUp = useCallback(async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'user'
            }
          }
        });
    
        if (error) {
          toast({
            variant: "destructive",
            title: "Falló el registro",
            description: error.message || "Algo salió mal",
          });
        } else {
           toast({
            title: "¡Cuenta creada!",
            description: "Por favor, revisa tu correo para verificar tu cuenta.",
          });
        }
    
        return { data, error };
      }, [toast]);
    
      const signIn = useCallback(async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
    
        if (error) {
          toast({
            variant: "destructive",
            title: "Falló el inicio de sesión",
            description: error.message || "Credenciales inválidas",
          });
        }
    
        return { error };
      }, [toast]);
    
      const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: "https://www.fractionfinance.cl/auth/callback",
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
    
        if (error) {
          toast({
            variant: "destructive",
            title: "Falló el inicio de sesión con Google",
            description: error.message || "Algo salió mal",
          });
        }
        return { error };
      }, [toast]);
    
      const value = useMemo(() => ({
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        refreshProfile,
      }), [user, profile, session, loading, signUp, signIn, signOut, signInWithGoogle, refreshProfile]);
    
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
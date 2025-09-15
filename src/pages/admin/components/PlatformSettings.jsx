import React, { useState, useEffect, useRef } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Loader2, Upload } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

    const TeamMemberManager = () => {
        const [team, setTeam] = useState([]);
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();
        const fileInputRefs = useRef({});

        useEffect(() => {
            fetchTeamMembers();
        }, []);

        const fetchTeamMembers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('team_members').select('*').order('created_at');
            if (error) {
                toast({ title: 'Error al obtener miembros del equipo', description: error.message, variant: 'destructive' });
            } else {
                setTeam(data);
            }
            setLoading(false);
        };

        const handleFileChange = async (event, memberId) => {
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${memberId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            setLoading(true);

            // Upload image
            let { error: uploadError } = await supabase.storage
                .from('team_avatars')
                .upload(filePath, file);

            if (uploadError) {
                toast({ title: 'Error al subir la imagen', description: uploadError.message, variant: 'destructive' });
                setLoading(false);
                return;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('team_avatars')
                .getPublicUrl(filePath);

            if (!urlData) {
                toast({ title: 'Error', description: 'No se pudo obtener la URL de la imagen.', variant: 'destructive' });
                setLoading(false);
                return;
            }
            const publicURL = urlData.publicUrl;

            // Update team_members table
            const { error: updateError } = await supabase
                .from('team_members')
                .update({ image_url: publicURL, updated_at: new Date().toISOString() })
                .eq('id', memberId);

            if (updateError) {
                toast({ title: 'Error al actualizar el miembro del equipo', description: updateError.message, variant: 'destructive' });
            } else {
                toast({ title: '¡Éxito!', description: 'Foto del miembro del equipo actualizada.' });
                fetchTeamMembers(); // Refresh data
            }
            setLoading(false);
        };

        const triggerFileInput = (memberId) => {
            fileInputRefs.current[memberId].click();
        };

        if (loading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={member.image_url} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={(el) => (fileInputRefs.current[member.id] = el)}
                            onChange={(e) => handleFileChange(e, member.id)}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                        />
                        <Button onClick={() => triggerFileInput(member.id)} variant="outline" disabled={loading}>
                            <Upload className="mr-2 h-4 w-4" />
                            {loading ? 'Subiendo...' : 'Cambiar Foto'}
                        </Button>
                    </div>
                ))}
            </div>
        );
    };


    const PlatformSettings = () => {
      const [settings, setSettings] = useState({});
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();

      useEffect(() => {
        const fetchSettings = async () => {
          setLoading(true);
          const { data, error } = await supabase.from('platform_settings').select('*');
          if (error) {
            toast({ title: 'Error al obtener la configuración', description: error.message, variant: 'destructive' });
          } else {
            const platformSettings = data.reduce((acc, setting) => {
              acc[setting.setting_name] = setting.is_enabled;
              return acc;
            }, {});
            setSettings(platformSettings);
          }
          setLoading(false);
        };
        fetchSettings();
      }, [toast]);

      const handleSettingChange = async (settingName, isEnabled) => {
        setSettings(prev => ({ ...prev, [settingName]: isEnabled }));

        const { error } = await supabase
          .from('platform_settings')
          .update({ is_enabled: isEnabled })
          .eq('setting_name', settingName);

        if (error) {
          toast({ title: `Error al actualizar ${settingName}`, description: error.message, variant: 'destructive' });
          setSettings(prev => ({ ...prev, [settingName]: !isEnabled }));
        } else {
          toast({ title: 'Configuración actualizada', description: `${settingName} ha sido ${isEnabled ? 'activado' : 'desactivado'}.` });
        }
      };

      const settingItems = [
        { name: 'show_global_markets', label: 'Activar Página de Mercados Globales', description: 'Controla la visibilidad de la página de producto "Mercados Globales".' },
        { name: 'show_rwa_invest', label: 'Activar Página de Inversión en RWA', description: 'Controla la visibilidad de la página de producto "Invertir en RWA".' },
      ];

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Plataforma</CardTitle>
              <CardDescription>Activa o desactiva las principales páginas y características de productos en toda la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {settingItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={item.name} className="text-base font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        id={item.name}
                        checked={settings[item.name] || false}
                        onCheckedChange={(checked) => handleSettingChange(item.name, checked)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Gestionar Fotos del Equipo</CardTitle>
                <CardDescription>Sube y actualiza las fotos para la sección "Conoce a la Fuerza Impulsora" en la página "Nuestra Empresa".</CardDescription>
             </CardHeader>
             <CardContent>
                <TeamMemberManager />
             </CardContent>
          </Card>

        </motion.div>
      );
    };

    export default PlatformSettings;
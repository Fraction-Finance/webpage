import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Loader2, Upload, Save } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { isEqual } from 'lodash';
    import { useSettings } from '@/contexts/SettingsContext';

    const PlatformSettings = () => {
      const [initialSettings, setInitialSettings] = useState({});
      const [settings, setSettings] = useState({});
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const { toast } = useToast();
      const { refreshSettings } = useSettings();

      const productPageItems = [
        { name: 'show_global_markets', label: 'Activar Página de Mercados Globales', description: 'Controla la visibilidad de la página de producto "Mercados Globales".' },
        { name: 'show_rwa_invest', label: 'Activar Página de Inversión en RWA', description: 'Controla la visibilidad de la página de producto "Invertir en RWA".' },
        { name: 'show_defi_assets', label: 'Activar Página de Activos DeFi', description: 'Controla la visibilidad de la página de producto "Activos DeFi".' },
      ];

      const homePageItems = [
        { name: 'show_home_defi', label: 'Mostrar sección "Activos DeFi"', description: 'Controla la visibilidad de la tarjeta "Activos DeFi" en la página de inicio.' },
        { name: 'show_home_tradfi', label: 'Mostrar sección "Finanzas Tradicionales"', description: 'Controla la visibilidad de la tarjeta "Finanzas Tradicionales" en la página de inicio.' },
        { name: 'show_home_real_assets', label: 'Mostrar sección "Activos Reales"', description: 'Controla la visibilidad de la tarjeta "Activos Reales" en la página de inicio.' },
      ];
      
      const productPageKeys = productPageItems.map(item => item.name);
      const homePageKeys = homePageItems.map(item => item.name);

      const fetchSettings = useCallback(async () => {
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
            setInitialSettings(platformSettings);
          }
          setLoading(false);
      }, [toast]);

      useEffect(() => {
        fetchSettings();
      }, [fetchSettings]);

      const handleSettingChange = (settingName, isEnabled) => {
        setSettings(prev => ({ ...prev, [settingName]: isEnabled }));
      };
      
      const handleSaveSettings = async (keysToSave) => {
        setSaving(true);
        const updates = keysToSave
          .filter(key => settings[key] !== initialSettings[key])
          .map(key => 
            supabase
              .from('platform_settings')
              .update({ is_enabled: settings[key] })
              .eq('setting_name', key)
          );

        if (updates.length === 0) {
            toast({ title: 'Sin cambios', description: 'No hay configuraciones nuevas que guardar.' });
            setSaving(false);
            return;
        }

        const results = await Promise.all(updates);
        const hasError = results.some(res => res.error);

        if (hasError) {
          toast({ title: `Error al guardar la configuración`, description: 'Algunas configuraciones no se pudieron guardar. Por favor, inténtelo de nuevo.', variant: 'destructive' });
        } else {
          toast({ title: '¡Éxito!', description: 'La configuración ha sido guardada.' });
          setInitialSettings(settings);
          if (refreshSettings) {
            await refreshSettings();
          }
        }
        setSaving(false);
      };

      const productSettingsChanged = !isEqual(
        Object.fromEntries(Object.entries(initialSettings).filter(([key]) => productPageKeys.includes(key))),
        Object.fromEntries(Object.entries(settings).filter(([key]) => productPageKeys.includes(key)))
      );

      const homeSettingsChanged = !isEqual(
        Object.fromEntries(Object.entries(initialSettings).filter(([key]) => homePageKeys.includes(key))),
        Object.fromEntries(Object.entries(settings).filter(([key]) => homePageKeys.includes(key)))
      );
      
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Páginas de Producto</CardTitle>
              <CardDescription>Activa o desactiva las principales páginas de productos en toda la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {productPageItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={item.name} className="text-base font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        id={item.name}
                        checked={settings[item.name] === true}
                        onCheckedChange={(checked) => handleSettingChange(item.name, checked)}
                        disabled={saving}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings(productPageKeys)} disabled={!productSettingsChanged || saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Configuración
                </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Página Principal</CardTitle>
              <CardDescription>Controla la visibilidad de las secciones de tipos de activos en la página de inicio.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {homePageItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={item.name} className="text-base font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        id={item.name}
                        checked={settings[item.name] === true}
                        onCheckedChange={(checked) => handleSettingChange(item.name, checked)}
                        disabled={saving}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings(homePageKeys)} disabled={!homeSettingsChanged || saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Configuración
                </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default PlatformSettings;
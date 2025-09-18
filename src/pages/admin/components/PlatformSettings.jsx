import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Loader2, Save, Trash2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { isEqual } from 'lodash';
    import { useSettings } from '@/contexts/SettingsContext';

    const PlatformSettings = () => {
      const [initialSettings, setInitialSettings] = useState({});
      const [settings, setSettings] = useState({});
      const [homeContent, setHomeContent] = useState({});
      const [initialHomeContent, setInitialHomeContent] = useState({});
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

      const fetchAllData = useCallback(async () => {
          setLoading(true);
          const [settingsRes, contentRes] = await Promise.all([
              supabase.from('platform_settings').select('*'),
              supabase.from('home_page_content').select('*')
          ]);

          if (settingsRes.error) {
            toast({ title: 'Error al obtener la configuración', description: settingsRes.error.message, variant: 'destructive' });
          } else {
            const platformSettings = settingsRes.data.reduce((acc, setting) => {
              acc[setting.setting_name] = setting.is_enabled;
              return acc;
            }, {});
            setSettings(platformSettings);
            setInitialSettings(platformSettings);
          }

          if (contentRes.error) {
            toast({ title: 'Error al obtener el contenido', description: contentRes.error.message, variant: 'destructive' });
          } else {
            const pageContent = contentRes.data.reduce((acc, item) => {
                acc[item.section_key] = { title: item.title, items: item.items };
                return acc;
            }, {});
            setHomeContent(pageContent);
            setInitialHomeContent(pageContent);
          }

          setLoading(false);
      }, [toast]);

      useEffect(() => {
        fetchAllData();
      }, [fetchAllData]);

      const handleSettingChange = (settingName, isEnabled) => {
        setSettings(prev => ({ ...prev, [settingName]: isEnabled }));
      };

      const handleContentChange = (sectionKey, field, value) => {
        setHomeContent(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [field]: value
            }
        }));
      };

      const handleItemChange = (sectionKey, itemIndex, value) => {
        setHomeContent(prev => {
            const newItems = [...prev[sectionKey].items];
            newItems[itemIndex] = value;
            return {
                ...prev,
                [sectionKey]: {
                    ...prev[sectionKey],
                    items: newItems
                }
            };
        });
      };

      const handleAddItem = (sectionKey) => {
        setHomeContent(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: [...prev[sectionKey].items, '']
            }
        }));
      };

      const handleRemoveItem = (sectionKey, itemIndex) => {
        setHomeContent(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                items: prev[sectionKey].items.filter((_, i) => i !== itemIndex)
            }
        }));
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

      const handleSaveContent = async () => {
        setSaving(true);
        const updates = Object.keys(homeContent)
            .filter(key => !isEqual(homeContent[key], initialHomeContent[key]))
            .map(key => 
                supabase
                    .from('home_page_content')
                    .update({ title: homeContent[key].title, items: homeContent[key].items })
                    .eq('section_key', key)
            );
        
        if (updates.length === 0) {
            toast({ title: 'Sin cambios', description: 'No hay contenido nuevo que guardar.' });
            setSaving(false);
            return;
        }

        const results = await Promise.all(updates);
        const hasError = results.some(res => res.error);

        if (hasError) {
            toast({ title: 'Error al guardar contenido', description: 'No se pudo guardar el contenido. Por favor, inténtelo de nuevo.', variant: 'destructive' });
        } else {
            toast({ title: '¡Éxito!', description: 'El contenido de la página principal ha sido guardado.' });
            setInitialHomeContent(homeContent);
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

      const homeContentChanged = !isEqual(initialHomeContent, homeContent);
      
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

          <Card>
            <CardHeader>
                <CardTitle>Contenido de la Página Principal</CardTitle>
                <CardDescription>Edita los títulos y elementos de las tarjetas de activos en la página de inicio.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(homeContent).map(sectionKey => (
                            <div key={sectionKey} className="p-4 border rounded-lg space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`${sectionKey}-title`} className="text-base font-medium">Título de la Sección</Label>
                                    <Input 
                                        id={`${sectionKey}-title`}
                                        value={homeContent[sectionKey]?.title || ''}
                                        onChange={(e) => handleContentChange(sectionKey, 'title', e.target.value)}
                                        disabled={saving}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-base font-medium">Elementos de la Lista</Label>
                                    {homeContent[sectionKey]?.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input 
                                                value={item}
                                                onChange={(e) => handleItemChange(sectionKey, index, e.target.value)}
                                                disabled={saving}
                                            />
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(sectionKey, index)} disabled={saving}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem(sectionKey)} disabled={saving}>
                                        Añadir Elemento
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSaveContent} disabled={!homeContentChanged || saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Contenido
                </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default PlatformSettings;
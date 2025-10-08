import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PlatformSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const settingLabels = {
        show_global_markets: 'Mercado de Capitales (Acciones, etc)',
        show_rwa_invest: 'Mercado RWA (Inmobiliario, etc)',
        show_defi_assets: 'Mercado DeFi',
        show_home_defi: 'Sección DeFi en Home',
        show_home_tradfi: 'Sección TradFi en Home',
        show_home_real_assets: 'Sección Activos Reales en Home',
        show_markets_portfolio: 'Pestaña "Mi Portafolio" en Mercados'
    };

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('platform_settings').select('*');
            if (error) {
                toast({ title: "Error", description: "Could not fetch platform settings.", variant: "destructive" });
            } else {
                const fetchedSettings = data.reduce((acc, setting) => {
                    acc[setting.setting_name] = setting.is_enabled;
                    return acc;
                }, {});
                setSettings(fetchedSettings);
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
            toast({ title: "Error", description: `Failed to update setting: ${settingName}`, variant: "destructive" });
            setSettings(prev => ({ ...prev, [settingName]: !isEnabled }));
        } else {
            toast({ title: "Success", description: `Setting ${settingLabels[settingName]} has been updated.` });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de la Plataforma</CardTitle>
                    <CardDescription>Activa o desactiva secciones y funcionalidades de la plataforma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Módulos de Mercados</CardTitle>
                            <CardDescription>Controla las pestañas visibles en la sección de Mercados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {Object.keys(settingLabels)
                                .filter(key => key.startsWith('show_markets_'))
                                .map(key => (
                                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label htmlFor={key} className="text-base">{settingLabels[key] || key}</Label>
                                    <Switch
                                        id={key}
                                        checked={settings[key] === true}
                                        onCheckedChange={(checked) => handleSettingChange(key, checked)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Secciones del Home</CardTitle>
                            <CardDescription>Controla los carruseles de productos en la página de inicio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {Object.keys(settingLabels)
                                .filter(key => key.startsWith('show_home_'))
                                .map(key => (
                                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label htmlFor={key} className="text-base">{settingLabels[key] || key}</Label>
                                    <Switch
                                        id={key}
                                        checked={settings[key] === true}
                                        onCheckedChange={(checked) => handleSettingChange(key, checked)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlatformSettings;
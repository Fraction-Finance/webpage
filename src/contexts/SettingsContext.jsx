import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const SettingsContext = createContext();

    export const useSettings = () => useContext(SettingsContext);

    export const SettingsProvider = ({ children }) => {
      const [settings, setSettings] = useState({
        show_global_markets: true,
        show_rwa_invest: true,
        show_defi_assets: true,
        show_home_defi: true,
        show_home_tradfi: true,
        show_home_real_assets: true,
      });
      const [loading, setLoading] = useState(true);

      const fetchSettings = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('platform_settings').select('*');
        
        if (error) {
          console.error('Error fetching platform settings:', error);
        } else {
          const newSettings = data.reduce((acc, setting) => {
            acc[setting.setting_name] = setting.is_enabled;
            return acc;
          }, {});
          setSettings(prev => ({...prev, ...newSettings}));
        }
        setLoading(false);
      }, []);


      useEffect(() => {
        fetchSettings();

        const channel = supabase
          .channel('platform_settings_changes')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'platform_settings' },
            (payload) => {
                fetchSettings();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }, [fetchSettings]);

      const value = useMemo(() => ({ settings, loading, refreshSettings: fetchSettings }), [settings, loading, fetchSettings]);

      return (
        <SettingsContext.Provider value={value}>
          {children}
        </SettingsContext.Provider>
      );
    };
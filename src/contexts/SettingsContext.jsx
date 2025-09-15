import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const SettingsContext = createContext();

    export const useSettings = () => useContext(SettingsContext);

    export const SettingsProvider = ({ children }) => {
      const [settings, setSettings] = useState({
        show_global_markets: true,
        show_rwa_invest: true,
      });
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchSettings = async () => {
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
        };

        fetchSettings();

        const channel = supabase
          .channel('platform_settings_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'platform_settings' },
            (payload) => {
              const { setting_name, is_enabled } = payload.new;
              setSettings(prev => ({ ...prev, [setting_name]: is_enabled }));
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }, []);

      const value = useMemo(() => ({ settings, loading }), [settings, loading]);

      return (
        <SettingsContext.Provider value={value}>
          {children}
        </SettingsContext.Provider>
      );
    };
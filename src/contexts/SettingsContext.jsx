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
        show_markets_portfolio: true,
      });
      const [homeContent, setHomeContent] = useState({});
      const [loading, setLoading] = useState(true);

      const fetchSettings = useCallback(async () => {
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
      }, []);

      const fetchHomeContent = useCallback(async () => {
        const { data, error } = await supabase.from('home_page_content').select('*');
        if (error) {
            console.error('Error fetching home page content:', error);
        } else {
            const content = data.reduce((acc, item) => {
                acc[item.section_key] = { title: item.title, items: item.items };
                return acc;
            }, {});
            setHomeContent(content);
        }
      }, []);

      const refreshAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchSettings(), fetchHomeContent()]);
        setLoading(false);
      }, [fetchSettings, fetchHomeContent]);


      useEffect(() => {
        refreshAllData();

        const settingsChannel = supabase
          .channel('platform_settings_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'platform_settings' },
            () => fetchSettings()
          )
          .subscribe();

        const contentChannel = supabase
          .channel('home_page_content_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'home_page_content' },
            () => fetchHomeContent()
          )
          .subscribe();

        return () => {
          supabase.removeChannel(settingsChannel);
          supabase.removeChannel(contentChannel);
        };
      }, [fetchSettings, fetchHomeContent]);

      const value = useMemo(() => ({ settings, homeContent, loading, refreshSettings: refreshAllData }), [settings, homeContent, loading, refreshAllData]);

      return (
        <SettingsContext.Provider value={value}>
          {children}
        </SettingsContext.Provider>
      );
    };
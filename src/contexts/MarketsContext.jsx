import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const MarketsContext = createContext();

export const useMarkets = () => useContext(MarketsContext);

export const MarketsProvider = ({ children }) => {
  const [stos, setStos] = useState([]);
  const [defiAssets, setDefiAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stosRes, defiRes] = await Promise.all([
          supabase.from('stos').select(`*, digital_assets (*)`).eq('is_published', true),
          supabase.from('defi_assets').select('*').eq('is_active', true)
        ]);

        if (stosRes.error) throw stosRes.error;
        if (defiRes.error) throw defiRes.error;

        setStos(stosRes.data || []);
        setDefiAssets(defiRes.data || []);
      } catch (err) {
        setError('No se pudieron cargar los datos de los mercados. Inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const value = {
    stos,
    defiAssets,
    loading,
    error,
  };

  return (
    <MarketsContext.Provider value={value}>
      {children}
    </MarketsContext.Provider>
  );
};
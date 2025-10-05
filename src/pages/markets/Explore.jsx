import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '@/contexts/MarketsContext';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import DigitalAssetCard from '@/components/markets/DigitalAssetCard';

const Explore = () => {
  const { stos, loading, error } = useMarkets();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = useMemo(() => {
    return stos.filter(sto => {
      const asset = sto.digital_assets;
      if (!asset) return false;
      return searchTerm === '' || asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [stos, searchTerm]);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-20 text-red-500"><p>{error}</p></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full md:w-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar activo o ticker..."
          className="pl-10 w-full md:w-80 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAssets.map((sto) => <DigitalAssetCard key={sto.id} sto={sto} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500"><p>No hay activos que coincidan con tus criterios.</p></div>
      )}
    </motion.div>
  );
};

export default Explore;
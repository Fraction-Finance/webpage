import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SummarySection = ({ title, icon: Icon, assets, valueKey, unit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAction = useCallback((stoId) => {
    if (stoId) {
      navigate(`/plataforma/invertir/${stoId}`);
    } else {
      toast({
        title: "🚧 ¡Esta característica aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
      });
    }
  }, [navigate, toast]);
  
  return (
    <Card className="glass-effect h-full flex flex-col">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2 text-lg">
          <Icon className="h-6 w-6 text-blue-500" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between group cursor-pointer" onClick={() => handleAction(asset.stoId)}>
            <div className="flex items-center gap-3">
              <img src={asset.image} alt={asset.name} className="h-9 w-9 rounded-full object-cover" src="https://images.unsplash.com/photo-1658204212985-e0126040f88f" />
              <div>
                <p className="font-semibold text-sm">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.symbol}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {valueKey === 'change' ? (
                <Badge 
                  variant={asset[valueKey] > 0 ? 'success' : 'destructive'} 
                >
                  {asset[valueKey] > 0 ? '+' : ''}{asset[valueKey].toFixed(1)}{unit}
                </Badge>
              ) : (
                <span className="text-sm font-medium">
                  {valueKey === 'volume' ? `${(asset[valueKey]/1000000).toFixed(1)}M` : new Date(asset[valueKey]).toLocaleDateString()}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const PlatformSummary = ({ stos }) => {
  const assetsWithMarketData = useMemo(() => {
    if (!stos || stos.length === 0) return [];
    
    return stos
      .filter(sto => sto.digital_assets)
      .map(sto => ({
        id: sto.digital_assets.id,
        stoId: sto.id,
        name: sto.digital_assets.name,
        symbol: sto.digital_assets.symbol,
        image: sto.digital_assets.asset_image_url,
        change: (Math.random() * 10) - 3, 
        volume: Math.random() * 200000000 + 50000000, 
        createdAt: sto.created_at,
      }));
  }, [stos]);

  const { topTraded, topGainers, newListings } = useMemo(() => {
    const sortedByVolume = [...assetsWithMarketData].sort((a, b) => b.volume - a.volume);
    const sortedByChange = [...assetsWithMarketData].sort((a, b) => b.change - a.change);
    const sortedByDate = [...assetsWithMarketData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return {
      topTraded: sortedByVolume.slice(0, 3),
      topGainers: sortedByChange.slice(0, 3),
      newListings: sortedByDate.slice(0, 3)
    };
  }, [assetsWithMarketData]);

  if (assetsWithMarketData.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
    >
      <SummarySection title="Tendencias del Mercado" icon={TrendingUp} assets={topTraded} valueKey="volume" unit="vol" />
      <SummarySection title="Mayores Ganancias (24h)" icon={Sparkles} assets={topGainers} valueKey="change" unit="%" />
      <SummarySection title="Nuevas Oportunidades" icon={Zap} assets={newListings} valueKey="createdAt" unit="" />
    </motion.div>
  );
};

export default PlatformSummary;
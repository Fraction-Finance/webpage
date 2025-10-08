import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '@/contexts/MarketsContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import CountUp from 'react-countup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const DeFiAssetCard = ({ asset, delay }) => {
  const handleCardClick = () => {
    if (asset.link_url) {
      window.open(asset.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const riskVariant = {
    low: 'success',
    medium: 'warning',
    high: 'destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card 
        className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/50 transition-all duration-300 group h-full flex flex-col cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center gap-4 p-6">
            <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300">
              <AvatarImage src={asset.image_url} alt={asset.name} />
              <AvatarFallback>{asset.symbol?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <CardTitle as="h3" className="text-lg font-bold">{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.network}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex-grow grid gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 h-[40px]">
              {asset.description}
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-border/10">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">APY</p>
                <p className="text-2xl font-bold text-green-500">
                  <CountUp end={asset.apy || 0} duration={1.5} decimals={2} suffix="%" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Riesgo</p>
                <Badge variant={riskVariant[asset.risk_level] || 'default'}>{asset.risk_level}</Badge>
              </div>
            </div>
             {asset.portfolio_assets && asset.portfolio_assets.length > 0 && (
              <div className="border-t border-border/10 pt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Portafolio</p>
                <div className="flex flex-wrap gap-2">
                  {asset.portfolio_assets.map(pa => (
                    <Badge key={pa} variant="secondary" className="text-xs font-semibold">{pa}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 bg-transparent mt-auto">
            <Button 
              variant="ghost"
              className="w-full text-primary hover:bg-primary/10 hover:text-primary"
            >
              Explorar Activo <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

const DeFi = () => {
  const { defiAssets, loading, error } = useMarkets();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (!defiAssets) return [];
    const uniqueCategories = [...new Set(defiAssets.map(asset => asset.category).filter(Boolean))];
    const orderedCategories = ['earn', 'lsts', 'lp_tokens', 'yield_bearing', 'derivatives', 'vault'];
    const sortedUniqueCategories = orderedCategories.filter(cat => uniqueCategories.includes(cat));
    const otherCategories = uniqueCategories.filter(cat => !orderedCategories.includes(cat));
    return ['Todos', ...sortedUniqueCategories, ...otherCategories];
  }, [defiAssets]);

  const filteredAssets = useMemo(() => {
    const activeAndSortedAssets = [...defiAssets]
      .filter(asset => asset.is_active)
      .sort((a, b) => (b.apy || 0) - (a.apy || 0));

    if (activeCategory === 'Todos') {
      return activeAndSortedAssets;
    }
    return activeAndSortedAssets.filter(asset => asset.category === activeCategory);
  }, [defiAssets, activeCategory]);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-20 text-red-500"><p>{error}</p></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Explorar Activos DeFi</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className="transition-all"
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      </div>

      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAssets.map((asset, index) => (
            <DeFiAssetCard key={asset.id} asset={asset} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>No se encontraron activos en esta categoría.</p>
        </div>
      )}
    </motion.div>
  );
};

export default DeFi;
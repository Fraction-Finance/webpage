import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '@/contexts/MarketsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

const DeFi = () => {
  const { defiAssets, loading, error } = useMarkets();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (!defiAssets) return [];
    const uniqueCategories = [...new Set(defiAssets.map(asset => asset.category))];
    return ['Todos', ...uniqueCategories];
  }, [defiAssets]);

  const filteredAssets = useMemo(() => {
    if (activeCategory === 'Todos') {
      return defiAssets;
    }
    return defiAssets.filter(asset => asset.category === activeCategory);
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
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Card className="glass-effect-light border-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Activo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">APY</TableHead>
                  <TableHead className="text-right">TVL</TableHead>
                  <TableHead>Riesgo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length > 0 ? filteredAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{asset.symbol.charAt(0)}</div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{asset.category}</Badge></TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-green-600">
                        <CountUp end={asset.apy} duration={1} decimals={2} suffix="%" />
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      $<CountUp end={asset.tvl} duration={1} separator="," />
                    </TableCell>
                    <TableCell><Badge variant={asset.risk_level === 'Bajo' ? 'success' : asset.risk_level === 'Medio' ? 'warning' : 'destructive'}>{asset.risk_level}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay activos en esta categoría.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeFi;
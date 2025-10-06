import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '@/contexts/MarketsContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

const DeFi = () => {
  const { defiAssets, loading, error } = useMarkets();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (!defiAssets) return [];
    const uniqueCategories = ['Stablecoins', 'Earn', 'Yield'];
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
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Bóvedas Destacadas</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden glass-effect hover:shadow-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-none group">
            <CardHeader className="flex flex-row items-start gap-4 p-6 bg-primary/5">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle as="h3" className="text-2xl font-bold">Stable Yield</CardTitle>
                <p className="text-muted-foreground">Rendimiento estable con exposición a USD en la red de Ethereum.</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <p className="text-muted-foreground leading-relaxed">
                  Esta bóveda invierte en una cartera diversificada de estrategias de rendimiento basadas en stablecoins, buscando maximizar los retornos mientras se minimiza el riesgo. Gestionada en <span className="font-semibold text-foreground">Enzyme</span> para total transparencia.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">APY Proyectado</p>
                <p className="text-4xl font-bold text-green-600">
                  <CountUp end={6.2} duration={1.5} decimals={1} suffix="%" />
                </p>
                <Badge variant="success" className="mt-2">Bajo Riesgo</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/30">
              <Button 
                asChild 
                className="w-full md:w-auto ml-auto"
                onClick={() => window.open('https://ff-stable-yield.enzyme.community/vault/0xd79d03fd1fd31ec07bde093731f4028cddb5db18', '_blank')}
              >
                <a href="https://ff-stable-yield.enzyme.community/vault/0xd79d03fd1fd31ec07bde093731f4028cddb5db18" target="_blank" rel="noopener noreferrer">
                  Explorar Bóveda <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

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
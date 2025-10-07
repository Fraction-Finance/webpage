
    import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarkets } from '@/contexts/MarketsContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, ExternalLink, ShieldCheck, Bitcoin, DollarSign } from 'lucide-react';
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

  const VaultCard = ({ icon, title, network, description, portfolioAssets, apy, risk, link, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="overflow-hidden glass-effect hover:shadow-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-none group h-full flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-start gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg shrink-0">
              {icon}
            </div>
            <div className="flex-grow">
              <CardTitle as="h3" className="text-xl font-bold">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{network}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 grid gap-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Portafolio</p>
                <div className="flex flex-wrap gap-2">
                  {portfolioAssets.map(asset => (
                    <Badge key={asset} variant="secondary" className="text-xs font-semibold">{asset}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex-1 md:text-right">
                 <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">APY Proyectado</p>
                 <p className="text-3xl font-bold text-green-500 mb-2">
                    <CountUp end={apy} duration={1.5} decimals={1} suffix="%" />
                  </p>
                  <Badge variant={risk === 'Bajo Riesgo' ? 'success' : 'warning'} className="mt-1">{risk}</Badge>
              </div>
            </div>
          </CardContent>
        </div>
        <CardFooter className="p-4 bg-primary/5 mt-auto">
          <Button 
            asChild 
            variant="ghost"
            className="w-full text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => window.open(link, '_blank')}
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              Explorar Bóveda <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Bóvedas Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <VaultCard 
            icon={<ShieldCheck className="h-7 w-7 text-primary" />}
            title="Stable Yield"
            network="Red de Ethereum"
            description="Esta bóveda invierte en un portafolio diversificado de estrategias de rendimiento basadas en las principales stablecoins del mercado, buscando maximizar los retornos y minimizar el riesgo. Gestionada a través de Enzyme."
            portfolioAssets={["USDC", "PYUSD", "USDT", "LUSD", "DAI"]}
            apy={6.2}
            risk="Bajo Riesgo"
            link="https://ff-stable-yield.enzyme.community/vault/0xd79d03fd1fd31ec07bde093731f4028cddb5db18"
            delay={0.2}
          />
          
          <VaultCard 
            icon={<Bitcoin className="h-7 w-7 text-primary" />}
            title="Wrapped BTC POL"
            network="Red de Polygon"
            description="Obtén rendimiento con tu Bitcoin de forma segura. Esta bóveda utiliza estrategias de yield farming con Wrapped Bitcoin en el ecosistema de Polygon. Gestionada a través de Enzyme."
            portfolioAssets={["WBTC", "aPolWBTC"]}
            apy={4.5}
            risk="Riesgo Medio"
            link="https://ff-apolwbtc.enzyme.community/vault/0xcb4697f0fa104e0d84865295971f5524170baa3f?network=polygon"
            delay={0.3}
          />

          <VaultCard 
            icon={<DollarSign className="h-7 w-7 text-primary" />}
            title="aPol Stable Yield"
            network="Red de Polygon"
            description="Estrategia de rendimiento optimizada para stablecoins en Polygon, ideal para quienes buscan exposición a dólar con bajo riesgo y liquidez. Esta bóveda invierte en un portafolio diversificado de activos de stablecoins. Gestionada a través de Enzyme."
            portfolioAssets={["aPolUSDC", "aPolDAI", "aPolUSDT"]}
            apy={8.1}
            risk="Bajo Riesgo"
            link="https://ff-apolusdc.enzyme.community/vault/0x528d97afd61c9dbaa302672696dd7fa90255e759?network=polygon"
            delay={0.4}
          />

        </div>
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
  
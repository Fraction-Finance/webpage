import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';

const DigitalAssetCard = ({ sto }) => {
  const navigate = useNavigate();
  const { digital_assets: asset } = sto;

  const fundingProgress = useMemo(() => {
    if (!sto.max_raise_amount || !sto.min_raise_amount) return 0;
    const raisedAmount = sto.min_raise_amount + (Math.random() * (sto.max_raise_amount - sto.min_raise_amount));
    return (raisedAmount / sto.max_raise_amount) * 100;
  }, [sto.max_raise_amount, sto.min_raise_amount]);

  const handleViewDetails = () => navigate(`/mercados/${sto.id}`);

  if (!asset) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden glass-effect hover:shadow-primary/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-none group">
        <CardHeader className="p-0">
          <div className="h-48 overflow-hidden relative">
            <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={asset.name} src="https://images.unsplash.com/photo-1683576235070-1f7685af03dd" />
            <Badge variant="secondary" className="absolute top-3 right-3 glass-effect-light">{sto.stock_market_category || asset.category}</Badge>
          </div>
          <div className="p-6">
            <CardTitle as="h3" className="text-xl font-bold leading-tight truncate">{asset.name}</CardTitle>
            <p className="text-sm text-gray-500">{asset.symbol}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-0">
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="text-left">
              <p className="text-gray-500">Precio Token</p>
              <p className="font-bold text-green-600 text-lg">
                $<CountUp end={sto.token_price} duration={1} decimals={2} />
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Inversión Mín.</p>
              <p className="font-bold text-lg">
                $<CountUp end={sto.min_investment} duration={1} separator="," />
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <span className="text-sm font-medium text-primary">
                <CountUp end={fundingProgress} duration={1} decimals={0} suffix="%" />
              </span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button className="w-full" onClick={handleViewDetails}>
            Ver Detalles <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DigitalAssetCard;
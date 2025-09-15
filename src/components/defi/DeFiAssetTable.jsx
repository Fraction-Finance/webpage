import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const defiAssets = [
  { name: 'SKY', subtitle: 'SKY Gobernación Token', network: 'Entero', apy: '15,10%', apySecondary: '12,26%', balance: '0,00', deposited: '0,00', totalAssets: '42,90 millones de', tvl: '3,17 millones de dólares' },
  { name: 'crvUSD-2', subtitle: 'Curve.Fi USD Stablecoin', network: 'Entero', apy: '1,25% y 12,52%', apySecondary: '6,81%', balance: '0,00', deposited: '0,00', totalAssets: '4,44 millones de', tvl: '4,43 millones de dólares' },
  { name: 'USDC.e', subtitle: 'Moneda del USD (PoS)', network: 'Polígono PoS', apy: '11,97%', apySecondary: '3,43%', balance: '0,00', deposited: '0,00', totalAssets: '205,69 k', tvl: '205,63 K' },
  { name: 'USDS', subtitle: 'USDS Stablecoin', network: 'Entero', apy: '5,75% 11,54%', apySecondary: '7,08%', balance: '0,00', deposited: '0,00', totalAssets: '28,39 millones', tvl: '28,38 millones de dólares' },
  { name: 'USDS-1', subtitle: 'yVault Liquid Locker Compounder', network: 'Entero', apy: '10,44%', apySecondary: '10,00%', balance: '0,00', deposited: '0,00', totalAssets: '1,03 millones de', tvl: '1,03 millones de dólares' },
  { name: 'crvUSD-2', subtitle: 'yVault Liquid Locker Compounder', network: 'Entero', apy: '9,63%', apySecondary: '12,30%', balance: '0,00', deposited: '0,00', totalAssets: '480,30 k', tvl: '479,71 K' },
  { name: 'USDC', subtitle: 'Moneda del USD', network: 'Polígono PoS', apy: '9,35%', apySecondary: '5,20%', balance: '0,00', deposited: '0,00', totalAssets: '243,42 k', tvl: '243,35 K' },
  { name: 'Ahorro USDaf', subtitle: 'USDaf Stablecoin', network: 'Entero', apy: '8,95%', apySecondary: '17,43%', balance: '0,00', deposited: '0,00', totalAssets: '2,82 millones de', tvl: '2,78 millones de reales' },
  { name: 'USDC.e-2', subtitle: 'Moneda USD (Arb1)', network: 'Arbitrum', apy: '8,70%', apySecondary: '13,83%', balance: '0,00', deposited: '0,00', totalAssets: '300,53 k', tvl: '300,48 K' },
  { name: 'USDT', subtitle: '(PoS) Tether USD', network: 'Polígono PoS', apy: '8,63%', apySecondary: '6,65%', balance: '0,00', deposited: '0,00', totalAssets: '253,15 k', tvl: '253,15 K' },
  { name: 'WETH', subtitle: 'Envuelta Ether', network: 'Entero', apy: '2,31% . 4,25%', apySecondary: '2,89%', balance: '0,00014043', deposited: '0,00', totalAssets: '2.545,01', tvl: '$11,51 millones' },
  { name: 'DAI', subtitle: 'Dai Stablecoin', network: 'Entero', apy: '5,11%', apySecondary: '7,48%', balance: '0,00', deposited: '0,00', totalAssets: '16,88 M', tvl: '$16,88 M' },
];

const DeFiAssetTable = () => {
  const getNetworkBadgeVariant = (network) => {
    if (network.toLowerCase().includes('entero')) return 'default';
    if (network.toLowerCase().includes('polígono')) return 'secondary';
    if (network.toLowerCase().includes('arbitrum')) return 'info';
    if (network.toLowerCase().includes('base')) return 'warning';
    return 'outline';
  };

  return (
    <Card className="glass-effect-light">
      <CardHeader>
        <CardTitle>Mercado de Activos DeFi</CardTitle>
        <CardDescription>Explora las oportunidades de rendimiento disponibles en el ecosistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activo</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Depositado</TableHead>
              <TableHead>Activos Totales</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defiAssets.map((asset, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Placeholder for asset icon */}
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      {asset.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.subtitle}</div>
                      <Badge variant={getNetworkBadgeVariant(asset.network)} className="mt-1">{asset.network}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-green-600">{asset.apy}</div>
                  <div className="text-sm text-muted-foreground">{asset.apySecondary}</div>
                </TableCell>
                <TableCell>{asset.balance}</TableCell>
                <TableCell>{asset.deposited}</TableCell>
                <TableCell>{asset.totalAssets}</TableCell>
                <TableCell>{asset.tvl}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeFiAssetTable;
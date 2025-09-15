import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const holdings = [
  { name: 'Apple Inc.', symbol: 'AAPL', value: 25000, change: 1.2, quantity: 145.14, icon: 'https://companiesmarketcap.com/img/company-logos/64/AAPL.png' },
  { name: 'SQM', symbol: 'SQM', value: 18500, change: -1.5, quantity: 408.38, icon: 'https://companiesmarketcap.com/img/company-logos/64/SQM.png' },
  { name: 'SPDR S&P 500 ETF', symbol: 'SPY', value: 42000, change: 0.9, quantity: 93.17, icon: 'https://companiesmarketcap.com/img/company-logos/64/SPY.png' },
  { name: 'Falabella', symbol: 'FALABELLA.SN', value: 12000, change: 0.5, quantity: 4705.88, icon: 'https://companiesmarketcap.com/img/company-logos/64/FALABELLA.SN.png' },
  { name: 'Microsoft Corp.', symbol: 'MSFT', value: 34000, change: -0.5, quantity: 100.00, icon: 'https://companiesmarketcap.com/img/company-logos/64/MSFT.png'},
];

const HoldingsList = () => {
  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Mis Activos</CardTitle>
        <CardDescription>Una descripción detallada de tus activos actuales.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Activo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Valor de Mercado</TableHead>
              <TableHead className="text-right">Cambio 24h</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-gray-100/50">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <img src={item.icon} alt={item.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.quantity.toFixed(2)}</TableCell>
                <TableCell className="font-medium">${item.value.toLocaleString()}</TableCell>
                <TableCell className={`text-right font-semibold flex items-center justify-end gap-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {item.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                   {Math.abs(item.change).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Operar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HoldingsList;
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CountUp from 'react-countup';

const HoldingsList = ({ holdings }) => {
  return (
    <Card className="glass-effect border-none h-full">
      <CardHeader>
        <CardTitle>Mis Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Valor Actual</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Retorno Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{holding.asset.symbol.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{holding.asset.name}</div>
                        <div className="text-sm text-muted-foreground">{holding.asset.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    $<CountUp end={holding.currentValue} duration={1} separator="," decimals={2} />
                  </TableCell>
                  <TableCell className="text-right">
                    <CountUp end={holding.quantity} duration={1} decimals={4} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.totalReturn >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      <span>
                        <CountUp end={holding.totalReturnPercent} duration={1} decimals={2} suffix="%" />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsList;
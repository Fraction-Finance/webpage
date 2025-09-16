import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const HoldingsList = ({ holdings }) => {
      if (!holdings || holdings.length === 0) {
        return (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Mis Activos</CardTitle>
              <CardDescription>Una descripción detallada de tus activos actuales.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground">No tienes inversiones todavía.</p>
              </div>
            </CardContent>
          </Card>
        );
      }

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
                  <TableHead className="text-right">Retorno Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-100/50">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img src={item.asset.asset_image_url || `https://companiesmarketcap.com/img/company-logos/64/${item.asset.symbol}.png`} alt={item.asset.name} className="h-10 w-10 rounded-full bg-gray-200" />
                        <div>
                          <div className="font-bold">{item.asset.name}</div>
                          <div className="text-sm text-muted-foreground">{item.asset.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{parseFloat(item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${item.currentValue.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className={`text-right font-semibold flex items-center justify-end gap-1 ${item.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {item.totalReturn >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                       {item.totalReturnPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/mercado-rwa/${item.sto_id}`}>Operar</Link>
                      </Button>
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
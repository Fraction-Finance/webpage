import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TransactionHistory = ({ investments }) => {
  if (!investments || investments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
            <CardDescription>
              Un registro de todos tus depósitos, retiros y operaciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <p className="text-muted-foreground">No hay transacciones para mostrar.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
          <CardDescription>
            Un registro de todas tus operaciones de compra.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transacción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-blue-600">{tx.id.substring(0, 8)}</TableCell>
                  <TableCell>{format(new Date(tx.purchase_date), "d MMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <ArrowUp className="h-4 w-4 text-red-500" />
                       Compra
                    </div>
                  </TableCell>
                  <TableCell>{tx.asset.name}</TableCell>
                  <TableCell>{parseFloat(tx.quantity).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${(tx.quantity * tx.purchase_price).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">Completado</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionHistory;
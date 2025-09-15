import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

const transactions = [
  { id: 'TX75634', date: '2025-08-28', type: 'Compra', asset: 'Apple Inc. (AAPL)', amount: 5000.00, status: 'Completado', direction: 'out' },
  { id: 'TX19873', date: '2025-08-25', type: 'Depósito', asset: 'USD', amount: 10000.00, status: 'Completado', direction: 'in' },
  { id: 'TX54321', date: '2025-08-22', type: 'Venta', asset: 'SQM (SQM)', amount: 2500.00, status: 'Completado', direction: 'in' },
  { id: 'TX98765', date: '2025-08-20', type: 'Retiro', asset: 'USD', amount: 1500.00, status: 'Pendiente', direction: 'out' },
  { id: 'TX11223', date: '2025-08-18', type: 'Compra', asset: 'SPDR S&P 500 ETF (SPY)', amount: 7800.00, status: 'Completado', direction: 'out' },
];

const getStatusVariant = (status) => {
  switch (status) {
    case 'Completado': return 'secondary';
    case 'Pendiente': return 'default';
    case 'Fallido': return 'destructive';
    default: return 'outline';
  }
};

const TransactionHistory = () => {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transacción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-blue-600">{tx.id}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {tx.direction === 'in' ? 
                         <ArrowDown className="h-4 w-4 text-green-500" /> : 
                         <ArrowUp className="h-4 w-4 text-red-500" />
                       }
                       {tx.type}
                    </div>
                  </TableCell>
                  <TableCell>{tx.asset}</TableCell>
                  <TableCell className="text-right font-semibold">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(tx.status)}>{tx.status}</Badge>
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
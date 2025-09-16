import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0052cc', '#007bff', '#5e9eff', '#87b4ff', '#c2d9ff'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 glass-effect rounded-lg shadow-lg border border-gray-200/50">
        <p className="font-semibold text-sm">{`${payload[0].name}: ${payload[0].value.toLocaleString('es-CL', { style: 'currency', currency: 'USD' })}`}</p>
        <p className="text-xs text-muted-foreground">{`(${payload[0].payload.percent.toFixed(2)}%)`}</p>
      </div>
    );
  }
  return null;
};

const AssetDetails = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Detalles del Activo</CardTitle>
            <CardDescription>
              Aquí encontrarás un desglose detallado de todos los activos en tu portafolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No tienes activos para mostrar.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const totalValue = holdings.reduce((sum, asset) => sum + asset.currentValue, 0);
  const chartData = holdings.map(asset => ({
    name: asset.asset.symbol,
    value: asset.currentValue,
    percent: (asset.currentValue / totalValue) * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Distribución de Activos</CardTitle>
          <CardDescription>
            Un desglose visual de la composición de tu portafolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetDetails;
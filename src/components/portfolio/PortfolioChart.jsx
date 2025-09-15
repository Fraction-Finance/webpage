import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const chartData = [
  { name: 'Ene', value: 80000 },
  { name: 'Feb', value: 85000 },
  { name: 'Mar', value: 95000 },
  { name: 'Abr', value: 92000 },
  { name: 'May', value: 105000 },
  { name: 'Jun', value: 115000 },
  { name: 'Jul', value: 125830.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 glass-effect rounded-lg shadow-lg border border-gray-200/50">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-blue-500 font-medium">{`Valor: $${payload[0].value.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
      </div>
    );
  }
  return null;
};

const PortfolioChart = () => {
  return (
    <Card className="glass-effect h-full">
      <CardHeader>
        <CardTitle>Rendimiento del Portafolio</CardTitle>
        <CardDescription>El valor de tu portafolio en los últimos 6 meses.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0052cc" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#0052cc" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value/1000)}k`} />
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#0052cc" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
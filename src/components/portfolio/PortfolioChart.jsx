import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const generateChartData = (holdings) => {
  if (!holdings || holdings.length === 0) {
    // Generate some placeholder data for a nice empty state chart
    const data = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
    for (let i = 0; i < months.length; i++) {
        data.push({ name: months[i], value: 0 });
    }
    return data;
  }

  const totalValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);
  const data = [];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];

  // Simulate historical data by generating values that lead up to the current total value
  for (let i = 0; i < months.length; i++) {
    const randomFactor = (Math.random() - 0.4) * 0.1;
    const baseValue = totalValue / (1 + (months.length - 1 - i) * 0.02);
    const value = i === months.length - 1 ? totalValue : baseValue * (1 + randomFactor);
    data.push({ name: months[i], value: value });
  }
  return data;
};


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

const PortfolioChart = ({ holdings }) => {
  const chartData = generateChartData(holdings);
  const isEmpty = !holdings || holdings.length === 0;

  return (
    <Card className="glass-effect h-full">
      <CardHeader>
        <CardTitle>Rendimiento del Portafolio</CardTitle>
        <CardDescription>
          {isEmpty 
            ? "Conecta tu wallet y empieza a invertir para ver tu progreso." 
            : "El valor de tus inversiones en la plataforma."
          }
        </CardDescription>
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
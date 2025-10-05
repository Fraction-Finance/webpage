import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-primary">{`Valor: $${payload[0].value.toFixed(2)}`}</p>
        <p className="text-muted-foreground">{`Porcentaje: ${(payload[0].payload.percent * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const AssetDetails = ({ holdings }) => {
  const chartData = useMemo(() => {
    const totalValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);
    if (totalValue === 0) return [];

    const groupedByCategory = holdings.reduce((acc, holding) => {
      const category = holding.asset.category || 'Otros';
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += holding.currentValue;
      return acc;
    }, {});

    return Object.values(groupedByCategory).map(item => ({
      ...item,
      percent: item.value / totalValue,
    }));
  }, [holdings]);

  return (
    <Card className="glass-effect border-none h-full">
      <CardHeader>
        <CardTitle>Distribución de Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
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
  );
};

export default AssetDetails;
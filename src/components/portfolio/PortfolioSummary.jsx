import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const portfolioData = {
  value: 125830.5,
  change: 1230.25,
  changePercent: 1.85,
  availableFunds: 15230.0,
};

const StatCard = ({ title, value, change, icon: Icon, changePercent }) => {
  const isPositive = change >= 0;
  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${value.toLocaleString('es-CL')}</div>
        {change !== undefined && changePercent !== undefined && (
          <p className={`text-sm mt-1 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}${change.toLocaleString('es-CL')} ({changePercent}%) Hoy
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const PortfolioSummary = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard 
        title="Valor Total del Portafolio" 
        value={portfolioData.value} 
        change={portfolioData.change}
        changePercent={portfolioData.changePercent}
        icon={TrendingUp}
      />
      <StatCard 
        title="Disponible para Invertir" 
        value={portfolioData.availableFunds} 
        icon={Wallet} 
      />
      <Card className="glass-effect overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Retorno del Portafolio</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">+ $25,830.50</div>
          <p className="text-sm mt-1 text-muted-foreground">
            Retorno total de la inversión
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
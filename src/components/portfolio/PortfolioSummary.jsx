import React from 'react';
import { Wallet, TrendingUp, Info, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value, icon: Icon, currencySymbol = 'USD', isCurrency = true, subText }) => {
  const formatValue = (val) => isCurrency ? `${val.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : val;

  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{isCurrency && currencySymbol} {formatValue(value)}</div>
        {subText && (
          <p className="text-sm mt-1 text-muted-foreground">
            {subText}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const PortfolioSummary = ({ summary }) => {
  const { totalValue, totalGainLoss, totalGainLossPercent, nativeBalance, nativeSymbol } = summary;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Valor de Inversiones" 
        value={totalValue} 
        icon={TrendingUp}
        subText="Valor de activos en plataforma"
        currencySymbol="$"
      />
      <StatCard 
        title="Balance en Wallet" 
        value={nativeBalance} 
        icon={Wallet}
        isCurrency={false}
        subText={`Balance de ${nativeSymbol} disponible`}
        currencySymbol=""
      />
      <StatCard 
        title="Retorno Total" 
        value={totalGainLoss} 
        icon={Banknote}
        subText={`${totalGainLossPercent.toFixed(2)}% de retorno histórico`}
        currencySymbol="$"
      />
      <Card className="glass-effect overflow-hidden bg-blue-50/50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Plataforma No Custodial</CardTitle>
          <Info className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-blue-900">Tú tienes el control</div>
          <p className="text-sm mt-1 text-blue-700">
            Tus activos y fondos permanecen en tu wallet personal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
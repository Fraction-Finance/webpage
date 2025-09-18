import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AssetDetails from '@/components/portfolio/AssetDetails';
import HoldingsList from '@/components/portfolio/HoldingsList';
import { LayoutDashboard, History, PieChart, Loader2, FolderKanban } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/lib/customSupabaseClient';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';
import { cn } from '@/lib/utils';

const Investment = () => {
  const { isConnected, wallet } = useWallet();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  const fetchPortfolio = useCallback(async () => {
    if (!isConnected || !wallet.address) {
      setPortfolioData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', wallet.address);

      if (profileError) throw profileError;

      const profile = profiles && profiles.length > 0 ? profiles[0] : null;

      if (!profile) {
        setPortfolioData({
          holdings: [],
          totalValue: 0,
          totalCost: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          nativeBalance: wallet.balance,
          nativeSymbol: wallet.network?.nativeCurrency?.symbol || '',
        });
        setLoading(false);
        return;
      }
      
      const { data: investments, error: investmentsError } = await supabase
        .from('user_investments')
        .select(`
          *,
          stos:sto_id (
            *,
            digital_assets:asset_id (*)
          )
        `)
        .eq('user_id', profile.id);

      if (investmentsError) throw investmentsError;
      
      const mockPriceApi = (symbol) => {
        const prices = { 'AAPL': 172.2, 'SQM': 45.3, 'SPY': 450.8, 'FALABELLA.SN': 2.5, 'MSFT': 340.0 };
        return prices[symbol] || Math.random() * 500;
      };

      const holdings = investments.map(inv => {
        const asset = inv.stos.digital_assets;
        const currentPrice = mockPriceApi(asset.symbol);
        const currentValue = inv.quantity * currentPrice;
        const costBasis = inv.quantity * inv.purchase_price;
        const totalReturn = currentValue - costBasis;
        const totalReturnPercent = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0;

        return {
          ...inv,
          asset,
          currentPrice,
          currentValue,
          costBasis,
          totalReturn,
          totalReturnPercent,
        };
      });

      const totalValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);
      const totalCost = holdings.reduce((acc, h) => acc + h.costBasis, 0);
      const totalGainLoss = totalValue - totalCost;
      const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

      setPortfolioData({
        holdings,
        totalValue,
        totalCost,
        totalGainLoss,
        totalGainLossPercent,
        nativeBalance: wallet.balance,
        nativeSymbol: wallet.network?.nativeCurrency?.symbol || '',
      });

    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, wallet.address, wallet.balance, wallet.network]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'holdings', label: 'Activos en Portafolio', icon: FolderKanban },
    { id: 'reporting', label: 'Reportería', icon: PieChart },
    { id: 'history', label: 'Transacciones', icon: History },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <PortfolioDashboard portfolioData={portfolioData} />;
      case 'holdings':
        return <HoldingsList holdings={portfolioData?.holdings} />;
      case 'reporting':
        return <AssetDetails holdings={portfolioData?.holdings} />;
      case 'history':
        return <TransactionHistory investments={portfolioData?.holdings} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Mi Portafolio | Fraction Finance</title>
        <meta name="description" content="Gestiona tu portafolio de activos tokenizados, sigue el rendimiento y descubre nuevas oportunidades de inversión en el panel de Fraction Finance." />
      </Helmet>
      <div className="pt-28 pb-12 bg-gray-50/50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Mi Portafolio</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Tu centro para gestionar y seguir tus activos digitales directamente desde tu wallet.
            </p>
          </motion.div>
          
          {!isConnected ? (
            <ConnectWalletPrompt />
          ) : loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <aside className="lg:col-span-3 mb-8 lg:mb-0">
                <nav className="space-y-1 glass-effect p-4 rounded-xl">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        'group rounded-md px-3 py-3 flex items-center text-sm font-medium transition-colors duration-200 w-full',
                        activeView === item.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 flex-shrink-0 h-5 w-5',
                          activeView === item.id ? 'text-primary' : 'text-gray-500 group-hover:text-gray-600'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Investment;
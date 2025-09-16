
    import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
    import TransactionHistory from '@/components/portfolio/TransactionHistory';
    import AssetDetails from '@/components/portfolio/AssetDetails';
    import { LayoutDashboard, History, PieChart, Loader2 } from 'lucide-react';
    import { useWallet } from '@/contexts/WalletContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';

    const Investment = () => {
      const { isConnected, wallet } = useWallet();
      const [portfolioData, setPortfolioData] = useState(null);
      const [loading, setLoading] = useState(true);

      const fetchPortfolio = useCallback(async () => {
        if (!isConnected || !wallet.address) {
          setPortfolioData(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          // 1. Find profile by wallet address
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', wallet.address);

          if (profileError) {
             throw profileError;
          }

          const profile = profiles && profiles.length > 0 ? profiles[0] : null;

          if (!profile) {
            // If no profile, then no investments on platform.
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
          
          // 2. Fetch investments for that profile
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
                className="flex flex-col md:flex-row justify-between md:items-center mb-8"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="gradient-text">Mi Portafolio</span>
                  </h1>
                  <p className="mt-2 text-lg text-muted-foreground">
                    Tu centro para gestionar y seguir tus activos digitales directamente desde tu wallet.
                  </p>
                </div>
              </motion.div>
              
              {!isConnected ? (
                <ConnectWalletPrompt />
              ) : loading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
              ) : (
                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 max-w-lg mx-auto bg-gray-200/80 p-1.5 rounded-lg">
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Panel
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Detalles
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Transacciones
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dashboard">
                    <PortfolioDashboard portfolioData={portfolioData} />
                  </TabsContent>
                  <TabsContent value="details">
                    <AssetDetails holdings={portfolioData?.holdings} />
                  </TabsContent>
                  <TabsContent value="history">
                    <TransactionHistory investments={portfolioData?.holdings} />
                  </TabsContent>
                </Tabs>
              )}
            </main>
          </div>
        </>
      );
    };

    export default Investment;
  
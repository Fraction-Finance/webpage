import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/lib/customSupabaseClient';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import HoldingsList from '@/components/portfolio/HoldingsList';
import AssetDetails from '@/components/portfolio/AssetDetails';

const PortfolioView = () => {
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
        const prices = { 'AAPL': 172.2, 'SQM': 45.3, 'SPY': 450.8, 'FALABELLA.SN': 2.5, 'MSFT': 340.0, 'ETH-LP': 1250, 'FF-FUND-1': 115 };
        return prices[symbol] || Math.random() * 500;
      };

      const realHoldings = investments.map(inv => {
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

      const mockDeFiInvestment = {
        id: 'mock-defi-1',
        quantity: 2.5,
        purchase_price: 1000,
        asset: {
          id: 'mock-asset-defi-1',
          name: 'ETH/USDC Liquidity Pool',
          symbol: 'ETH-LP',
          category: 'DeFi',
        },
        currentPrice: mockPriceApi('ETH-LP'),
        currentValue: 2.5 * mockPriceApi('ETH-LP'),
        costBasis: 2.5 * 1000,
        totalReturn: (2.5 * mockPriceApi('ETH-LP')) - (2.5 * 1000),
        totalReturnPercent: (((2.5 * mockPriceApi('ETH-LP')) - (2.5 * 1000)) / (2.5 * 1000)) * 100,
      };

      const mockFundInvestment = {
        id: 'mock-fund-1',
        quantity: 50,
        purchase_price: 100,
        asset: {
          id: 'mock-asset-fund-1',
          name: 'Fraction Finance Growth Fund',
          symbol: 'FF-FUND-1',
          category: 'Fondo',
        },
        currentPrice: mockPriceApi('FF-FUND-1'),
        currentValue: 50 * mockPriceApi('FF-FUND-1'),
        costBasis: 50 * 100,
        totalReturn: (50 * mockPriceApi('FF-FUND-1')) - (50 * 100),
        totalReturnPercent: (((50 * mockPriceApi('FF-FUND-1')) - (50 * 100)) / (50 * 100)) * 100,
      };

      const holdings = [...realHoldings, mockDeFiInvestment, mockFundInvestment];

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!portfolioData || portfolioData.holdings.length === 0) {
    return (
      <div className="text-center p-8 glass-effect rounded-xl">
        <h3 className="text-xl font-semibold">No tienes inversiones</h3>
        <p className="text-muted-foreground mt-2">Explora los mercados para comenzar a invertir.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PortfolioDashboard portfolioData={portfolioData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HoldingsList holdings={portfolioData.holdings} />
        </div>
        <AssetDetails holdings={portfolioData.holdings} />
      </div>
    </motion.div>
  );
};

export default PortfolioView;
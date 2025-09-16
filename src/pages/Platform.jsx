import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, ArrowRight, TrendingUp, Briefcase, FileText, Building, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import PlatformSummary from '@/components/platform/PlatformSummary';
import { useWallet } from '@/contexts/WalletContext';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';

const AssetCard = ({ sto }) => {
  const navigate = useNavigate();
  const { digital_assets: asset } = sto;

  const fundingProgress = useMemo(() => {
    if (!sto.max_raise_amount || !sto.min_raise_amount) return 0;
    const raisedAmount = sto.min_raise_amount + (Math.random() * (sto.max_raise_amount - sto.min_raise_amount));
    return (raisedAmount / sto.max_raise_amount) * 100;
  }, [sto.max_raise_amount, sto.min_raise_amount]);

  const handleViewDetails = useCallback(() => {
    navigate(`/plataforma/invertir/${sto.id}`);
  }, [navigate, sto.id]);

  if (!asset) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden glass-effect hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="h-48 overflow-hidden relative">
            <img class="w-full h-full object-cover" alt={asset.name} src="https://images.unsplash.com/photo-1500401519266-0b71b29a05e0" />
            <Badge variant="secondary" className="absolute top-2 right-2">{sto.stock_market_category || asset.category}</Badge>
          </div>
          <div className="p-6">
            <CardTitle as="h2" className="text-xl font-bold leading-tight">{asset.name}</CardTitle>
            <p className="text-sm text-gray-500">{asset.symbol}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-0">
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Precio del Token</p>
              <p className="font-bold text-green-600 text-lg">${sto.token_price.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Inversión Mínima</p>
              <p className="font-bold text-lg">${sto.min_investment.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progreso de Financiación</span>
              <span className="text-sm font-medium text-green-600">{fundingProgress.toFixed(0)}%</span>
            </div>
            <Progress value={fundingProgress} />
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white" onClick={handleViewDetails}>
            Ver Detalles <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Platform = () => {
  const [stos, setStos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { isConnected } = useWallet();

  useEffect(() => {
    const fetchStos = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('stos')
          .select(`
            *,
            digital_assets (
              *
            )
          `)
          .eq('is_published', true);

        if (error) throw error;
        
        setStos(data || []);
      } catch (err) {
        console.error('Error al obtener STOs:', err);
        setError('No se pudieron cargar las oportunidades de inversión. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStos();
  }, []);

  const categoryFilters = useMemo(() => [
    { name: 'Todo', icon: Briefcase, category: 'All' },
    { name: 'Acciones', icon: TrendingUp, category: 'Stocks' },
    { name: 'Bonos', icon: FileText, category: 'Bonds' },
    { name: 'Fondos', icon: Building, category: 'Funds' }
  ], []);

  const filteredStos = useMemo(() => {
    return stos.filter(sto => {
      const asset = sto.digital_assets;
      if (!asset) return false;

      const matchesCategory = activeCategory === 'All' || sto.stock_market_category === activeCategory;
      const matchesSearch = searchTerm === '' || asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [stos, activeCategory, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Fondos y Mercado de Capitales | Fraction Finance</title>
        <meta name="description" content="Descubre, analiza e invierte en activos tokenizados del mercado chileno." />
      </Helmet>
      <div className="pt-24 pb-12 bg-gray-50/50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-10 mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gray-900">Fondos y Mercado de Capitales</span>
            </h1>
            <p className="text-lg text-gray-600">
              Descubre, analiza e invierte en activos tokenizados del mercado chileno.
            </p>
          </motion.div>

          {!isConnected ? (
            <div className="py-10">
              <ConnectWalletPrompt />
            </div>
          ) : (
            <>
              <PlatformSummary stos={stos} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10"
              >
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-full">
                  {categoryFilters.map(cat => (
                    <Button
                      key={cat.name}
                      variant={activeCategory === cat.category ? 'default' : 'ghost'}
                      onClick={() => setActiveCategory(cat.category)}
                      className={`rounded-full transition-all duration-300 ${activeCategory === cat.category ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'text-gray-600'}`}
                    >
                      {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                      {cat.name}
                    </Button>
                  ))}
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar activo o ticker"
                    className="pl-10 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </motion.div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                 <div className="text-center py-20 text-red-500">
                    <p className="text-xl font-semibold">¡Oops! Algo salió mal.</p>
                    <p>{error}</p>
                  </div>
              ) : filteredStos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredStos.map((sto) => (
                    <AssetCard key={sto.id} sto={sto} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-500"
                >
                  <p className="text-xl">No hay oportunidades que coincidan con tus criterios.</p>
                  <p>Intenta ajustar tu búsqueda o filtros de categoría.</p>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Platform;
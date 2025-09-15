import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft, Copy, Shield, TrendingUp, Layers, DollarSign, BarChart, FileText, CheckCircle, Briefcase, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';

const StatCard = ({ title, children, className = '' }) => (
  <Card className={`bg-white shadow-sm ${className}`}>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const InfoRow = ({ icon: Icon, title, value, subvalue, copyable }) => {
    const { toast } = useToast();
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: "¡Copiado al portapapeles!", description: text });
    };

    return (
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-1 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center">
            <p className="font-semibold text-gray-800">{value}</p>
            {copyable && (
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => copyToClipboard(value)}>
                    <Copy className="h-4 w-4 text-gray-500" />
                </Button>
            )}
          </div>
          {subvalue && <p className="text-xs text-gray-500">{subvalue}</p>}
        </div>
      </div>
    );
};

const StatsTable = ({ title, data }) => (
  <div className="mt-4">
    <h4 className="font-semibold text-gray-600 mb-2">{title}</h4>
    <div className="divide-y divide-gray-200">
      {data.map((item, index) => (
        <div key={index} className="flex justify-between py-2">
          <span className="text-sm text-gray-500">{item.label}</span>
          <span className="text-sm font-medium text-gray-800">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const BuySellPanel = ({ sto }) => {
  const { toast } = useToast();
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [selectedStablecoin, setSelectedStablecoin] = useState('USDC');
  const { wallet, connectWallet } = useWallet();
  const asset = sto.digital_assets;
  const stablecoins = ['USDC', 'USDT'];

  const handlePayChange = (e) => {
    const value = e.target.value;
    setPayAmount(value);
    if (value && !isNaN(value)) {
      setReceiveAmount((parseFloat(value) / sto.token_price).toFixed(6));
    } else {
      setReceiveAmount('');
    }
  };

  const handleReceiveChange = (e) => {
    const value = e.target.value;
    setReceiveAmount(value);
    if (value && !isNaN(value)) {
      setPayAmount((parseFloat(value) * sto.token_price).toFixed(2));
    } else {
      setPayAmount('');
    }
  };

  const handleBuy = () => {
    toast({
      title: "🚧 Característica No Implementada",
      description: "¡Esta característica aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  return (
    <Card className="glass-effect-light sticky top-28 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Comprar / Vender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="buy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Comprar</TabsTrigger>
            <TabsTrigger value="sell" disabled>Vender</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pay" className="text-gray-700">Pagar</Label>
                <div className="relative">
                  <Input id="pay" type="number" placeholder="0" value={payAmount} onChange={handlePayChange} className="pr-24"/>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                     <Select value={selectedStablecoin} onValueChange={setSelectedStablecoin}>
                        <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Moneda" />
                        </SelectTrigger>
                        <SelectContent>
                            {stablecoins.map(coin => <SelectItem key={coin} value={coin}>{coin}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Balance: 0 {selectedStablecoin}</p>
              </div>
              <div>
                <Label htmlFor="receive" className="text-gray-700">Recibir</Label>
                <div className="relative">
                  <Input id="receive" type="number" placeholder="0" value={receiveAmount} onChange={handleReceiveChange} className="pr-20"/>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">{asset.symbol}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Balance: 0 {asset.symbol}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="text-sm space-y-2 pt-4">
          <div className="flex justify-between text-gray-800">
            <span className="text-gray-500">Tasa</span>
            <span>1 {asset.symbol} = {sto.token_price.toFixed(2)} {selectedStablecoin} (${sto.token_price})</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <span className="text-gray-500">Acciones por Token</span>
            <span>1 {asset.symbol} = 1.00 {asset.symbol.replace('on', '')}</span>
          </div>
        </div>
        {wallet && wallet.address ? (
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white" onClick={handleBuy}>
                Comprar {asset.symbol}
            </Button>
        ) : (
            <Button className="w-full" onClick={() => connectWallet()}>Conectar Billetera</Button>
        )}
      </CardContent>
    </Card>
  );
};

const InvestDetail = () => {
    const { stoId } = useParams();
    const navigate = useNavigate();
    const [sto, setSto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [activeTimeRange, setActiveTimeRange] = useState('1M');

    useEffect(() => {
        const fetchStoDetails = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('stos')
                .select(`*, digital_assets (*)`)
                .eq('id', stoId)
                .single();

            if (error || !data) {
                console.error('Error al obtener detalles del STO:', error);
                navigate('/plataforma', { replace: true });
            } else {
                setSto(data);
            }
            setLoading(false);
        };

        if (stoId) {
            fetchStoDetails();
        }
    }, [stoId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!sto) return null;

    const { digital_assets: asset } = sto;
    const priceChange24h = 0.33; // Placeholder
    const priceChangePercent24h = 0.1838; // Placeholder

    const timeRanges = ['1D', '1S', '1M', '3M', '1A', 'TODO'];

    const mockStats = {
      tokenPrice: [
        { label: 'Apertura', value: '$177.27' },
        { label: 'Máximo', value: '$178.59' },
        { label: 'Mínimo', value: '$176.46' },
      ],
      underlyingPrice: [
        { label: 'Apertura', value: '$177.26' },
        { label: 'Máximo', value: '$178.59' },
        { label: 'Mínimo', value: '$176.45' },
      ],
      underlyingStats: [
        { label: 'Cap. de Mercado Total', value: '$4.32T' },
        { label: 'Volumen 24h', value: '124,799,226' },
        { label: 'Volumen Promedio', value: '235,075,296' },
      ],
      dividend: [
          { label: 'Rendimiento por Dividendo', value: '0.02%' },
          { label: 'Frecuencia de Pago', value: 'Trimestral' },
          { label: 'Último Dividendo', value: '$0.01' },
      ]
    };

    return (
        <>
            <Helmet>
                <title>Invertir en {asset.name} | Fraction Finance</title>
                <meta name="description" content={`Información detallada y opciones de inversión para ${asset.name}`} />
            </Helmet>
            <div className="pt-24 pb-12 bg-gray-50 text-gray-800 min-h-screen hero-pattern">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button variant="ghost" onClick={() => navigate('/plataforma')} className="mb-6 text-gray-600 hover:bg-gray-200 hover:text-gray-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la Plataforma
                        </Button>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img className="w-12 h-12 mr-4 rounded-full" alt={`${asset.name} logo`} src={asset.asset_image_url || "https://images.unsplash.com/photo-1701439063562-fae1a60c6ba2"} />
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
                                            <p className="text-lg text-gray-500">{asset.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-900">${sto.token_price.toFixed(2)}</p>
                                        <p className="text-sm text-green-600">
                                            +${priceChange24h.toFixed(2)} (+{priceChangePercent24h.toFixed(4)}%) 24H
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <Card className="bg-white shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex justify-end mb-4">
                                            {timeRanges.map(range => (
                                                <Button
                                                    key={range}
                                                    variant={activeTimeRange === range ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setActiveTimeRange(range)}
                                                    className={`text-xs ${activeTimeRange === range ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                                                >
                                                    {range}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                                            <BarChart className="w-16 h-16 text-gray-400" />
                                            <p className="absolute text-gray-500">Datos del gráfico no disponibles</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <StatCard title="Acerca de">
                                    <p className={`text-gray-600 text-sm leading-relaxed ${!showMore && 'line-clamp-4'}`}>
                                        {asset.description || 'No hay descripción disponible.'}
                                    </p>
                                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm mt-2" onClick={() => setShowMore(!showMore)}>
                                        {showMore ? 'Mostrar Menos' : 'Mostrar Más'}
                                    </Button>
                                </StatCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid md:grid-cols-2 gap-8">
                                <StatCard title="Detalles del Activo">
                                    <div className="space-y-4">
                                        <InfoRow icon={Globe} title="Cadenas Soportadas" value="Ethereum" />
                                        <InfoRow icon={ExternalLink} title="Dirección Onchain" value={asset.contract_address ? `${asset.contract_address.substring(0,6)}...${asset.contract_address.substring(asset.contract_address.length - 4)}` : "No disponible"} copyable={!!asset.contract_address} />
                                        <InfoRow icon={Layers} title="Categoría" value={sto.stock_market_category} />
                                        <InfoRow icon={FileText} title="Activo Subyacente" value={`Acción Ordinaria de ${asset.name}`} />
                                        <InfoRow icon={TrendingUp} title="Ticker Subyacente" value={asset.symbol.replace('on', '')} />
                                        <InfoRow icon={DollarSign} title="Acciones por Token" value={`1 ${asset.symbol} = 1.00 ${asset.symbol.replace('on', '')}`} />
                                    </div>
                                </StatCard>
                                <StatCard title="Protecciones al Tenedor de Tokens">
                                    <div className="space-y-4">
                                        <InfoRow icon={Shield} title="Garantía sobre Colateral" value="Sí" />
                                        <InfoRow icon={CheckCircle} title="A prueba de quiebra" value="Sí" />
                                        <InfoRow icon={Briefcase} title="Emisión y Redención" value="Monto Mínimo: $1" />
                                    </div>
                                </StatCard>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <StatCard title="Estadísticas">
                                    <StatsTable title="Precio del Token 24H" data={mockStats.tokenPrice} />
                                    <StatsTable title="Precio del Activo Subyacente 24H" data={mockStats.underlyingPrice} />
                                    <StatsTable title="Estadísticas del Activo Subyacente" data={mockStats.underlyingStats} />
                                    <StatsTable title="Dividendo del Activo Subyacente" data={mockStats.dividend} />
                                </StatCard>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="lg:col-span-1"
                        >
                            <BuySellPanel sto={sto} />
                        </motion.div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default InvestDetail;
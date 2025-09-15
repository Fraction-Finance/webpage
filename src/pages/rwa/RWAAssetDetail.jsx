import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, FileText, Banknote, MapPin, DollarSign, Target, PieChart, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const RWAAssetDetail = () => {
    const { stoId } = useParams();
    const { toast } = useToast();
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssetDetails = async () => {
            if (!stoId) return;

            setLoading(true);
            const { data, error } = await supabase
                .from('stos')
                .select(`
                    *,
                    digital_assets (
                        *
                    )
                `)
                .eq('id', stoId)
                .single();

            if (error) {
                console.error('Error fetching asset details:', error);
                setAsset(null);
            } else {
                const formattedAsset = {
                    id: data.id,
                    name: data.digital_assets.name,
                    category: data.digital_assets.category,
                    description: data.digital_assets.description,
                    asset_image_url: data.digital_assets.asset_image_url,
                    token_price: data.token_price,
                    min_investment: data.min_investment,
                    max_investment: data.max_investment,
                    min_raise: data.min_raise_amount,
                    max_raise: data.max_raise_amount,
                    funding_progress: 0, // Placeholder
                    // These fields do not exist in the schema, using placeholders
                    total_valuation: data.max_raise_amount || 0, 
                    target_irr: '12-15%',
                    dividend_yield: '4.5%',
                    location: { address: 'Dirección no especificada' },
                    documents: [
                        { name: 'Prospecto de Inversión', url: '#' },
                        { name: 'Reporte de Tasación', url: '#' },
                    ]
                };
                setAsset(formattedAsset);
            }
            setLoading(false);
        };

        fetchAssetDetails();
    }, [stoId]);

    const handleInvest = () => {
        toast({
            title: "🚧 ¡Esta función aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="pt-24 pb-12 text-center">
                <h1 className="text-2xl font-bold">Activo no encontrado</h1>
                <p className="mt-4">El activo que buscas no existe o no está disponible.</p>
                <Link to="/mercado-rwa">
                    <Button className="mt-6">Volver al Mercado</Button>
                </Link>
            </div>
        );
    }
    
    const tokensToReceive = investmentAmount && asset.token_price > 0
        ? (parseFloat(investmentAmount) / asset.token_price).toFixed(4)
        : 0;

    return (
        <>
            <Helmet>
                <title>{asset.name} | Inversión RWA</title>
                <meta name="description" content={`Información detallada y oportunidad de inversión para ${asset.name}.`} />
            </Helmet>
            <div className="pt-24 pb-12">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/mercado-rwa" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al Mercado
                        </Link>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="overflow-hidden glass-effect">
                                    <div className="h-64 md:h-96 overflow-hidden">
                                        <img class="w-full h-full object-cover" alt={asset.name} src="https://images.unsplash.com/photo-1627577741153-74b82d87607b" />
                                    </div>
                                    <CardHeader>
                                        <Badge variant="secondary" className="w-fit mb-2">{asset.category}</Badge>
                                        <CardTitle className="text-3xl md:text-4xl font-bold">{asset.name}</CardTitle>
                                    </CardHeader>
                                </Card>

                                <Tabs defaultValue="resumen" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="resumen">Resumen</TabsTrigger>
                                        <TabsTrigger value="financieros">Financieros</TabsTrigger>
                                        <TabsTrigger value="documentos">Documentos</TabsTrigger>
                                        <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="resumen">
                                        <Card className="glass-effect">
                                            <CardContent className="pt-6">
                                                <p className="text-gray-700 leading-relaxed">{asset.description}</p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="financieros">
                                        <Card className="glass-effect">
                                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-start">
                                                    <Banknote className="h-8 w-8 text-primary mr-4 mt-1" />
                                                    <div>
                                                        <p className="font-semibold">Valoración Total</p>
                                                        <p className="text-2xl font-bold text-gray-800">${asset.total_valuation.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <Target className="h-8 w-8 text-green-500 mr-4 mt-1" />
                                                    <div>
                                                        <p className="font-semibold">TIR Objetivo</p>
                                                        <p className="text-2xl font-bold text-gray-800">{asset.target_irr}</p>
                                                    </div>
                                                </div>
                                                 <div className="flex items-start">
                                                    <PieChart className="h-8 w-8 text-primary mr-4 mt-1" />
                                                    <div>
                                                        <p className="font-semibold">Rentabilidad por Dividendo</p>
                                                        <p className="text-2xl font-bold text-gray-800">{asset.dividend_yield}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="documentos">
                                        <Card className="glass-effect">
                                            <CardContent className="pt-6 space-y-3">
                                                {asset.documents.map(doc => (
                                                    <a key={doc.name} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <FileText className="h-5 w-5 mr-3 text-gray-600" />
                                                        <span className="font-medium text-primary hover:underline">{doc.name}</span>
                                                    </a>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="ubicacion">
                                        <Card className="glass-effect">
                                            <CardContent className="pt-6">
                                               <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <p className="text-gray-500">Área del Mapa (Integración con OpenStreetMap)</p>
                                                </div>
                                                <div className="flex items-center mt-4">
                                                    <MapPin className="h-5 w-5 mr-3 text-gray-600"/>
                                                    <p>{asset.location.address}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                            
                            <div className="lg:col-span-1 sticky top-28">
                                <Card className="glass-effect shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Invertir en este Activo</CardTitle>
                                        <CardDescription>Meta de Financiamiento: ${asset.max_raise.toLocaleString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">Progreso de Financiamiento</span>
                                                <span className="text-sm font-medium text-primary">{asset.funding_progress}%</span>
                                            </div>
                                            <Progress value={asset.funding_progress} />
                                        </div>
                                        <div className="flex justify-between items-baseline pt-4">
                                            <span className="text-gray-600">Precio del Token</span>
                                            <span className="text-2xl font-bold text-green-600">${asset.token_price.toFixed(2)}</span>
                                        </div>
                                         <div className="flex justify-between items-baseline">
                                            <span className="text-gray-600">Inversión Mín.</span>
                                            <span className="font-semibold">${asset.min_investment.toLocaleString()}</span>
                                        </div>

                                        <div className="pt-4">
                                            <label htmlFor="investment-amount" className="font-medium">Monto de Inversión (USD)</label>
                                            <div className="relative mt-1">
                                                 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <Input 
                                                    id="investment-amount"
                                                    type="number"
                                                    placeholder={asset.min_investment.toString()}
                                                    className="pl-10"
                                                    value={investmentAmount}
                                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center bg-gray-100 p-3 rounded-md">
                                            <p className="text-sm text-gray-600">Recibirás aprox.</p>
                                            <p className="text-xl font-bold text-primary">{tokensToReceive} Tokens</p>
                                        </div>

                                        <Button size="lg" className="w-full mt-4" onClick={handleInvest}>
                                            Invertir Ahora
                                        </Button>

                                        <div className="flex items-start text-xs text-gray-500 mt-2">
                                            <Info className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                                            <span>Tu inversión está sujeta a términos y condiciones. Por favor, revisa todos los documentos.</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default RWAAssetDetail;
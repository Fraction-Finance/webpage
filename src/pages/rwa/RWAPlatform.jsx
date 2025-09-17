import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building, Droplets, HardHat, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/customSupabaseClient';
import { useWallet } from '@/contexts/WalletContext';
import ConnectWalletPrompt from '@/components/ConnectWalletPrompt';

const RWAPlatform = () => {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isConnected } = useWallet();

    useEffect(() => {
        const fetchOpportunities = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('stos')
                .select(`
                    id,
                    token_price,
                    min_investment,
                    tokens_for_sale,
                    digital_assets (
                        id,
                        name,
                        category,
                        asset_image_url
                    )
                `)
                .eq('is_published', true)
                .eq('status', 'Abierta');

            if (error) {
                console.error('Error fetching RWA opportunities:', error);
                setOpportunities([]);
            } else {
                const formattedData = data.map(sto => ({
                    id: sto.id,
                    name: sto.digital_assets.name,
                    category: sto.digital_assets.category,
                    token_price: sto.token_price,
                    min_investment: sto.min_investment,
                    funding_progress: 0, // This needs to be calculated based on investments
                    asset_image_url: sto.digital_assets.asset_image_url
                }));
                setOpportunities(formattedData);
            }
            setLoading(false);
        };

        fetchOpportunities();
    }, []);

    const categoryFilters = [
        { name: 'Todos', icon: null },
        { name: 'Inmobiliario', icon: Building },
        { name: 'Materias Primas', icon: Droplets },
        { name: 'Infraestructura', icon: HardHat },
    ];

    const handleViewDetails = (stoId) => {
        navigate(`/mercado-rwa/${stoId}`);
    };

    const filteredOpportunities = useMemo(() => {
        return opportunities.filter(opp => {
            const matchesCategory = activeCategory === 'Todos' || opp.category === activeCategory;
            const matchesSearch = searchTerm === '' || opp.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm, opportunities]);

    return (
        <>
            <Helmet>
                <title>Mercado RWA | Fraction Finance</title>
                <meta name="description" content="Descubra oportunidades de inversión seleccionadas en activos tokenizados." />
            </Helmet>
            <div className="pt-24 pb-12">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 pt-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Mercado RWA
                        </h1>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            Descubra oportunidades de inversión seleccionadas en activos tokenizados.
                        </p>
                    </motion.div>

                    {!isConnected ? (
                        <div className="py-10">
                            <ConnectWalletPrompt />
                        </div>
                    ) : (
                        <>
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
                                            variant={activeCategory === cat.name ? 'default' : 'ghost'}
                                            onClick={() => setActiveCategory(cat.name)}
                                            className={`rounded-full transition-all duration-300 ${activeCategory === cat.name ? 'bg-primary text-primary-foreground shadow-md' : 'text-gray-600'}`}
                                        >
                                            {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                                            {cat.name}
                                        </Button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-auto">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Buscar oportunidades..."
                                        className="pl-10 w-full md:w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </motion.div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                </div>
                            ) : filteredOpportunities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredOpportunities.map((opp, index) => (
                                        <motion.div
                                            key={opp.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                        >
                                            <Card className="h-full flex flex-col overflow-hidden glass-effect hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                                <CardHeader className="p-0">
                                                    <div className="h-48 overflow-hidden">
                                                        <img className="w-full h-full object-cover" alt={opp.name} src={opp.asset_image_url || "https://images.unsplash.com/photo-1643568963826-ab9ad9e34121"} />
                                                    </div>
                                                    <div className="p-6">
                                                        <Badge variant="secondary" className="w-fit mb-2">{opp.category}</Badge>
                                                        <CardTitle className="text-xl font-bold leading-tight">{opp.name}</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-grow p-6 pt-0">
                                                    <div className="flex justify-between items-center mb-4 text-sm">
                                                        <div className="text-center">
                                                            <p className="text-gray-500">Precio del Token</p>
                                                            <p className="font-bold text-green-600 text-lg">${opp.token_price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-gray-500">Inversión Mín.</p>
                                                            <p className="font-bold text-lg">${opp.min_investment.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">Progreso de Financiamiento</span>
                                                            <span className="text-sm font-medium text-green-600">{opp.funding_progress}%</span>
                                                        </div>
                                                        <Progress value={opp.funding_progress} />
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-6 pt-0">
                                                    <Button className="w-full bg-primary" onClick={() => handleViewDetails(opp.id)}>
                                                        Ver Detalles <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 text-gray-500"
                                >
                                    <p className="text-xl">No hay oportunidades que coincidan con tus criterios.</p>
                                    <p>Intenta ajustar tu búsqueda o los filtros de categoría.</p>
                                </motion.div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default RWAPlatform;
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Shield, LineChart, Target, FileText, BrainCircuit, Users, Copy, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#004eff', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const VaultDetail = () => {
    const { vaultId } = useParams();
    const { toast } = useToast();
    const [vault, setVault] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            const { data: vaultData, error: vaultError } = await supabase
                .from('tokenized_vaults')
                .select(`*, digital_assets (name, symbol, contract_address)`)
                .eq('id', vaultId)
                .single();

            if (vaultError) {
                toast({ title: "Error", description: `No se pudo cargar el fondo: ${vaultError.message}`, variant: "destructive" });
                setLoading(false);
                return;
            }
            setVault(vaultData);

            const { data: holdingsData, error: holdingsError } = await supabase
                .from('vault_holdings')
                .select(`*, digital_assets (name, symbol, total_supply)`)
                .eq('vault_id', vaultId);
            
            if (holdingsError) {
                toast({ title: "Error", description: `No se pudieron cargar los activos del fondo: ${holdingsError.message}`, variant: "destructive" });
            } else {
                setHoldings(holdingsData);
            }

            setLoading(false);
        };
        fetchData();
    }, [vaultId, toast]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copiado!", description: "La dirección del contrato ha sido copiada." });
    };

    const holdingsChartData = useMemo(() => {
        if (!holdings.length) return [];
        return holdings.map(h => ({
            name: h.digital_assets.symbol,
            value: parseFloat(h.quantity)
        }));
    }, [holdings]);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (!vault) {
        return <div className="text-center py-10">Fondo no encontrado.</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Link to="/administracion/fondos" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista de fondos
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-8 w-8 text-primary" />
                                <CardTitle className="text-3xl">{vault.name}</CardTitle>
                            </div>
                            <CardDescription>Gestor: {vault.manager || 'N/A'}</CardDescription>
                        </div>
                        <div className="text-right">
                           <Badge>{vault.asset_type}</Badge>
                           <p className="text-sm text-muted-foreground mt-1">Token: ${vault.digital_assets?.symbol}</p>
                           {vault.digital_assets?.contract_address && (
                            <div className="flex items-center gap-1 text-xs mt-1">
                                <span>{vault.digital_assets.contract_address.substring(0, 6)}...{vault.digital_assets.contract_address.slice(-4)}</span>
                                <Copy className="h-3 w-3 cursor-pointer" onClick={() => copyToClipboard(vault.digital_assets.contract_address)} />
                            </div>
                           )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de IA */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5" /> Análisis IA</CardTitle>
                        <CardDescription>Proyecciones y sugerencias (simulado).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm">Predicción de Rentabilidad (1A)</h4>
                            <p className="text-lg font-bold text-green-600">+8.5%</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Nivel de Riesgo</h4>
                            <p className="text-lg font-bold text-orange-500">Moderado</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm">Sugerencia de Optimización</h4>
                            <p className="text-sm text-muted-foreground">Considerar aumentar exposición a 'Activo C' en un 5% para mejorar el ratio Sharpe.</p>
                        </div>
                        <Button className="w-full" disabled>
                            <FileText className="mr-2 h-4 w-4" /> Generar Reporte Automático
                            <Badge variant="outline" className="ml-2">Pronto</Badge>
                        </Button>
                    </CardContent>
                </Card>
                {/* Cartera del Fondo y Gráfico */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5" /> Cartera del Fondo</CardTitle>
                        <CardDescription>Activos que componen el fondo actualmente.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Table>
                                <TableHeader><TableRow><TableHead>Activo</TableHead><TableHead className="text-right">Cantidad</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {holdings.length > 0 ? holdings.map(h => (
                                        <TableRow key={h.id}>
                                            <TableCell>{h.digital_assets.name} (${h.digital_assets.symbol})</TableCell>
                                            <TableCell className="text-right">{Number(h.quantity).toLocaleString()}</TableCell>
                                        </TableRow>
                                    )) : <TableRow><TableCell colSpan="2" className="text-center">El fondo está vacío.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                            <Button variant="outline" className="w-full mt-4" disabled><PlusCircle className="mr-2 h-4 w-4"/>Modificar Cartera</Button>
                        </div>
                        <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={holdingsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {holdingsChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Otros Paneles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><LineChart className="mr-2 h-5 w-5" /> Rendimiento y Métricas</CardTitle></CardHeader>
                    <CardContent>
                         <p className="text-center text-muted-foreground p-8">Visualizaciones de rendimiento histórico y valor del token (NAV) aparecerán aquí.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Inversionistas (Whitelist)</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground p-8">La gestión de la whitelist y las interacciones de los inversionistas (depósitos, redenciones) se manejarán aquí.</p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default VaultDetail;
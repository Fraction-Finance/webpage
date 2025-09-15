import React, { useState, useEffect, useCallback } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { useAlchemy, useAlchemyWebSocket } from '@/contexts/AlchemyContext';
    import { Loader2, Search, Rss, Package, Globe } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ethers } from 'ethers';
    import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

    const LatestBlock = () => {
        const { provider, currentNetwork } = useAlchemy();
        const [blockInfo, setBlockInfo] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!provider) return;

            const fetchBlock = async () => {
                try {
                    setLoading(true);
                    const blockNumber = await provider.getBlockNumber();
                    const block = await provider.getBlock(blockNumber);
                    setBlockInfo({ number: block.number, hash: block.hash });
                } catch (error) {
                    console.error("Error fetching block:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchBlock();
            const interval = setInterval(fetchBlock, 15000);
            return () => clearInterval(interval);
        }, [provider]);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5" /> Último Bloque ({currentNetwork.name})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <div className="space-y-2">
                            <p className="text-2xl font-bold">{blockInfo?.number}</p>
                            <p className="text-xs text-muted-foreground break-all">Hash: {blockInfo?.hash}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const TokenBalances = () => {
        const { getTokenBalances, currentNetwork } = useAlchemy();
        const [address, setAddress] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
        const [balances, setBalances] = useState([]);
        const [loading, setLoading] = useState(false);

        const fetchBalances = useCallback(async () => {
            if (!address || !ethers.isAddress(address)) return;
            setLoading(true);
            setBalances([]);
            const result = await getTokenBalances(address);
            if (result && result.tokenBalances) {
                const provider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl);
                const formattedBalances = await Promise.all(result.tokenBalances.map(async (b) => {
                    const contract = new ethers.Contract(b.contractAddress, ['function decimals() view returns (uint8)', 'function symbol() view returns (string)'], provider);
                    try {
                        const decimals = await contract.decimals();
                        const symbol = await contract.symbol();
                        const balance = ethers.formatUnits(b.tokenBalance, decimals);
                        return { symbol, balance: parseFloat(balance).toFixed(4) };
                    } catch {
                        return { symbol: 'Unknown', balance: 'N/A' };
                    }
                }));
                setBalances(formattedBalances.filter(b => parseFloat(b.balance) > 0));
            }
            setLoading(false);
        }, [address, getTokenBalances, currentNetwork.rpcUrl]);

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Balances de Tokens ERC20/BEP20</CardTitle>
                    <CardDescription>Busca los balances de tokens para una dirección en {currentNetwork.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..."/>
                        <Button onClick={fetchBalances} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto pr-2">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : balances.length > 0 ? (
                            <ul className="space-y-2">
                                {balances.map((b, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                        <span className="font-bold">{b.symbol}</span>
                                        <span>{b.balance}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Sin balances o dirección no encontrada.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const PendingTransactions = () => {
        const { currentNetwork } = useAlchemy();
        const [transactions, setTransactions] = useState([]);
        const maxTx = 10;

        const handleMessage = useCallback((message) => {
            if (message.method === "eth_subscription" && message.params?.result) {
                const result = message.params.result;
                const txHash = typeof result === 'object' && result.hash ? result.hash : result;
                if (typeof txHash === 'string') {
                    setTransactions(prev => [{ hash: txHash, id: Date.now() }, ...prev.slice(0, maxTx - 1)]);
                }
            }
        }, []);

        useAlchemyWebSocket(handleMessage);
        
        useEffect(() => {
            setTransactions([]);
        }, [currentNetwork]);

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Rss className="mr-2 h-5 w-5 text-orange-500 animate-pulse" /> Transacciones en Vivo ({currentNetwork.name})</CardTitle>
                    <CardDescription>Flujo en tiempo real de transacciones minadas.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 overflow-hidden relative">
                    <AnimatePresence>
                        {transactions.map((tx) => (
                            <motion.div
                                key={tx.id}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="text-xs font-mono p-1.5 mb-1 bg-muted rounded"
                            >
                                <a href={`${currentNetwork.explorer}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">
                                    {tx.hash}
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </CardContent>
            </Card>
        );
    };

    const NetworkExplorer = () => {
        const { switchNetwork, networkKey } = useAlchemy();

        return (
            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Explorador de Red</h1>
                    <Tabs value={networkKey} onValueChange={switchNetwork}>
                        <TabsList>
                            <TabsTrigger value="mainnet">
                                <Globe className="mr-2 h-4 w-4" /> Mainnet
                            </TabsTrigger>
                            <TabsTrigger value="sepolia">
                                <Globe className="mr-2 h-4 w-4" /> Sepolia
                            </TabsTrigger>
                            <TabsTrigger value="bsc">
                                <Globe className="mr-2 h-4 w-4" /> BNB Chain
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <LatestBlock />
                        <TokenBalances />
                    </div>
                    <div className="space-y-6">
                        <PendingTransactions />
                    </div>
                </div>
            </div>
        );
    };

    export default NetworkExplorer;
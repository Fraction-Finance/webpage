import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import {
      Table,
      TableHeader,
      TableBody,
      TableHead,
      TableRow,
      TableCell,
    } from '@/components/ui/table';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogDescription
    } from '@/components/ui/dialog';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { PlusCircle, Search, Copy, Loader2 } from 'lucide-react';
    import CreateAssetWizard from '@/pages/admin/components/CreateAssetWizard';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Badge } from '@/components/ui/badge';

    const ManageDigitalAssets = () => {
      const [assets, setAssets] = useState([]);
      const [filteredAssets, setFilteredAssets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const { toast } = useToast();
      const { user } = useAuth();

      const fetchAssets = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
          .from('digital_assets')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          toast({ title: 'Error fetching assets', description: error.message, variant: 'destructive' });
        } else {
          setAssets(data);
          setFilteredAssets(data);
        }
        setLoading(false);
      }

      useEffect(() => {
        fetchAssets();
      }, [user]);

      useEffect(() => {
        const results = assets.filter(asset =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.category && asset.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredAssets(results);
      }, [searchTerm, assets]);

      const handleAssetCreated = () => {
        setIsDialogOpen(false);
        toast({ title: "Success!", description: "Asset list updated." });
        fetchAssets();
      };

      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard!", description: text });
      };

      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Manage Digital Assets</CardTitle>
                <CardDescription>Create, view, and manage on-chain digital assets.</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Asset</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Digital Asset Tokenization Wizard</DialogTitle>
                    <DialogDescription>Create a new on-chain asset from a secure template.</DialogDescription>
                  </DialogHeader>
                  <CreateAssetWizard onAssetCreated={handleAssetCreated} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets by name, symbol, or category..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contract Address</TableHead>
                  <TableHead className="text-right">Total Supply</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="5" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : filteredAssets.length > 0 ? (
                  filteredAssets.map(asset => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.symbol}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{asset.category?.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        {asset.contract_address ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{`${asset.contract_address.substring(0, 6)}...${asset.contract_address.substring(asset.contract_address.length - 4)}`}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(asset.contract_address)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Off-Chain</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">{asset.total_supply ? Number(asset.total_supply).toLocaleString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow><TableCell colSpan="5" className="text-center h-24">No assets found. Create one to get started!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    };

    export default ManageDigitalAssets;
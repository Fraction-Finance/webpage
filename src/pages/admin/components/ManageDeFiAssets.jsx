import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const DeFiAssetForm = ({ asset, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    category: 'earn',
    description: '',
    apy: '',
    tvl: '',
    risk_level: 'low',
    contract_address: '',
    is_active: true,
    ...asset,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSave = {
      ...formData,
      apy: formData.apy ? parseFloat(formData.apy) : null,
      tvl: formData.tvl ? parseFloat(formData.tvl) : null,
    };

    let response;
    if (asset?.id) {
      response = await supabase.from('defi_assets').update(dataToSave).eq('id', asset.id);
    } else {
      response = await supabase.from('defi_assets').insert(dataToSave);
    }

    if (response.error) {
      toast({ title: 'Error', description: response.error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: `Activo DeFi ${asset?.id ? 'actualizado' : 'creado'} correctamente.` });
      onSave();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="symbol">Símbolo</Label>
          <Input id="symbol" name="symbol" value={formData.symbol} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="earn">Earn</SelectItem>
            <SelectItem value="lsts">LSTs</SelectItem>
            <SelectItem value="lp_tokens">LP tokens</SelectItem>
            <SelectItem value="yield_bearing">Yield-bearing tokens</SelectItem>
            <SelectItem value="derivatives">Derivados DeFi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="apy">APY (%)</Label>
          <Input id="apy" name="apy" type="number" step="0.01" value={formData.apy} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="tvl">TVL (USD)</Label>
          <Input id="tvl" name="tvl" type="number" step="0.01" value={formData.tvl} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="risk_level">Nivel de Riesgo</Label>
        <Select value={formData.risk_level} onValueChange={(value) => handleSelectChange('risk_level', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Bajo</SelectItem>
            <SelectItem value="medium">Medio</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contract_address">Dirección del Contrato</Label>
        <Input id="contract_address" name="contract_address" value={formData.contract_address} onChange={handleChange} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => handleSwitchChange('is_active', checked)} />
        <Label htmlFor="is_active">Activo</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Guardar
        </Button>
      </DialogFooter>
    </form>
  );
};

const ManageDeFiAssets = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const { toast } = useToast();

  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('defi_assets').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setAssets(data);
      setFilteredAssets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const results = assets.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssets(results);
  }, [searchTerm, assets]);

  const handleSave = () => {
    setIsDialogOpen(false);
    setEditingAsset(null);
    fetchAssets();
  };

  const handleOpenDialog = (asset = null) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDelete = async (assetId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este activo?')) {
      const { error } = await supabase.from('defi_assets').delete().eq('id', assetId);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Éxito', description: 'Activo eliminado.' });
        fetchAssets();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Gestionar Activos DeFi</CardTitle>
            <CardDescription>Crear, ver y gestionar activos del ecosistema DeFi.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingAsset(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Crear Activo DeFi</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAsset ? 'Editar' : 'Crear'} Activo DeFi</DialogTitle>
                <DialogDescription>Completa los detalles de tu activo DeFi.</DialogDescription>
              </DialogHeader>
              <DeFiAssetForm asset={editingAsset} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, símbolo o categoría..."
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
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan="6" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name} ({asset.symbol})</TableCell>
                  <TableCell><Badge variant="secondary">{asset.category.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell>{asset.apy ? `${asset.apy}%` : 'N/A'}</TableCell>
                  <TableCell>{asset.tvl ? `$${Number(asset.tvl).toLocaleString()}` : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={asset.is_active ? 'default' : 'destructive'}>
                      {asset.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(asset)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(asset.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan="6" className="text-center h-24">No se encontraron activos.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageDeFiAssets;
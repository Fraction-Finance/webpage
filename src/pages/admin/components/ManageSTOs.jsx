import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from '@/components/ui/select';
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
      DialogDescription,
      DialogTrigger,
      DialogFooter,
      DialogClose,
    } from '@/components/ui/dialog';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
    } from "@/components/ui/dropdown-menu"
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog"
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { PlusCircle, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
    import { Badge } from '@/components/ui/badge';

    const ManageSTOs = () => {
      const [stos, setStos] = useState([]);
      const [assets, setAssets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [newSto, setNewSto] = useState({
        asset_id: '', tokens_for_sale: '', token_price: '', start_date: '', end_date: '',
        min_raise_amount: '', max_raise_amount: '', min_investment: '', max_investment: '',
        accepted_stablecoin: 'USDC', status: 'Upcoming', sto_type: '', stock_market_category: '', is_published: false
      });
      const [editingSto, setEditingSto] = useState(null);
      const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [stoToDelete, setStoToDelete] = useState(null);
      const [selectedAssetInfo, setSelectedAssetInfo] = useState({ name: '', symbol: '' });
      const { toast } = useToast();

      useEffect(() => {
        fetchStosAndAssets();
      }, []);

      async function fetchStosAndAssets() {
        setLoading(true);
        const { data: stoData, error: stoError } = await supabase.from('stos').select('*, digital_assets(name, symbol)').order('created_at', { ascending: false });
        if (stoError) toast({ title: 'Error al obtener STOs', description: stoError.message, variant: 'destructive' });
        else setStos(stoData);

        const { data: assetData, error: assetError } = await supabase.from('digital_assets').select('id, name, symbol');
        if (assetError) toast({ title: 'Error al obtener activos', description: assetError.message, variant: 'destructive' });
        else setAssets(assetData);
        
        setLoading(false);
      }

      const handleInputChange = (e, targetSto, setTargetSto) => {
        const { name, value } = e.target;
        setTargetSto(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSelectChange = (name, value, targetSto, setTargetSto) => {
        const updatedSto = { ...targetSto, [name]: value };
        if (name === 'sto_type') {
            updatedSto.stock_market_category = ''; 
        }
        setTargetSto(updatedSto);

        if (name === 'asset_id') {
          const asset = assets.find(a => a.id === value);
          setSelectedAssetInfo(asset ? { name: asset.name, symbol: asset.symbol } : { name: '', symbol: '' });
        }
      };
      
      const resetCreateForm = () => {
          setNewSto({
            asset_id: '', tokens_for_sale: '', token_price: '', start_date: '', end_date: '',
            min_raise_amount: '', max_raise_amount: '', min_investment: '', max_investment: '',
            accepted_stablecoin: 'USDC', status: 'Upcoming', sto_type: '', stock_market_category: '', is_published: false
          });
          setSelectedAssetInfo({ name: '', symbol: '' });
          setIsCreateDialogOpen(false);
      }

      const handleCreateSto = async () => {
        const requiredFields = ['asset_id', 'tokens_for_sale', 'token_price', 'start_date', 'end_date', 'max_raise_amount', 'sto_type'];
        if (requiredFields.some(field => !newSto[field])) {
          toast({ title: 'Campos faltantes', description: 'Por favor, rellena todos los campos obligatorios.', variant: 'destructive' });
          return;
        }
        if ((newSto.sto_type === 'Stock Market' || newSto.sto_type === 'Real Assets') && !newSto.stock_market_category) {
            toast({ title: 'Campos faltantes', description: 'Por favor, selecciona una categoría.', variant: 'destructive' });
            return;
        }

        const { data, error } = await supabase.from('stos').insert([newSto]).select('*, digital_assets(name, symbol)').single();
        if (error) {
          toast({ title: 'Error al crear STO', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'STO Creado', description: `El STO para ${data.digital_assets.name} ha sido creado con éxito.` });
          setStos(prev => [data, ...prev]);
          resetCreateForm();
        }
      };

      const openEditDialog = (sto) => {
        const formattedSto = {
          ...sto,
          start_date: sto.start_date ? new Date(sto.start_date).toISOString().slice(0, 16) : '',
          end_date: sto.end_date ? new Date(sto.end_date).toISOString().slice(0, 16) : '',
        };
        setEditingSto(formattedSto);
        setIsEditDialogOpen(true);
      };

      const handleUpdateSto = async () => {
        const { id, digital_assets, ...updateData } = editingSto;
        const { data, error } = await supabase.from('stos').update(updateData).eq('id', id).select('*, digital_assets(name, symbol)').single();

        if (error) {
          toast({ title: 'Error al actualizar STO', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'STO Actualizado', description: `El STO para ${data.digital_assets.name} ha sido actualizado con éxito.` });
          setStos(prev => prev.map(sto => sto.id === id ? data : sto));
          setIsEditDialogOpen(false);
          setEditingSto(null);
        }
      };
      
      const openDeleteDialog = (sto) => {
        setStoToDelete(sto);
        setIsDeleteDialogOpen(true);
      }

      const handleDeleteSto = async () => {
        if (!stoToDelete) return;
        const { error } = await supabase.from('stos').delete().eq('id', stoToDelete.id);
        if (error) {
            toast({ title: "Error al eliminar STO", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "STO Eliminado", description: `El STO para ${stoToDelete.digital_assets.name} ha sido eliminado.` });
            setStos(prev => prev.filter(s => s.id !== stoToDelete.id));
        }
        setIsDeleteDialogOpen(false);
        setStoToDelete(null);
      };

      const handleTogglePublish = async (sto) => {
        const newPublishedState = !sto.is_published;
        const { data, error } = await supabase
            .from('stos')
            .update({ is_published: newPublishedState })
            .eq('id', sto.id)
            .select('*, digital_assets(name, symbol)')
            .single();

        if (error) {
            toast({ title: "Error en la Actualización", description: error.message, variant: "destructive" });
        } else {
            toast({
                title: "Estado del STO Actualizado",
                description: `${data.digital_assets.name} ha sido ${newPublishedState ? 'publicado' : 'despublicado'}.`,
            });
            setStos(prev => prev.map(s => s.id === sto.id ? data : s));
        }
      };

      const StoForm = ({ stoData, setStoData, isEdit = false }) => (
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="asset_id">Activo Digital</Label>
                <Select
                    value={stoData.asset_id}
                    onValueChange={(value) => handleSelectChange('asset_id', value, stoData, setStoData)}
                    disabled={isEdit}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                    {assets.map(asset => (
                        <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
                 <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select value={stoData.status} onValueChange={(value) => handleSelectChange('status', value, stoData, setStoData)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Upcoming">Próximo</SelectItem>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="Ended">Finalizado</SelectItem>
                            <SelectItem value="Cancelled">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="sto_type">Tipo de STO</Label>
                    <Select value={stoData.sto_type} name="sto_type" onValueChange={(value) => handleSelectChange('sto_type', value, stoData, setStoData)}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar tipo de STO" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Stock Market">Mercado de Valores</SelectItem>
                            <SelectItem value="Real Assets">Activos Reales</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {stoData.sto_type === 'Stock Market' && (
                    <div>
                        <Label htmlFor="stock_market_category">Categoría de Mercado de Valores</Label>
                        <Select value={stoData.stock_market_category} name="stock_market_category" onValueChange={(value) => handleSelectChange('stock_market_category', value, stoData, setStoData)}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Stocks">Acciones</SelectItem>
                                <SelectItem value="Bonds">Bonos</SelectItem>
                                <SelectItem value="Funds">Fondos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {stoData.sto_type === 'Real Assets' && (
                    <div>
                        <Label htmlFor="stock_market_category">Categoría de Activos Reales</Label>
                        <Select value={stoData.stock_market_category} name="stock_market_category" onValueChange={(value) => handleSelectChange('stock_market_category', value, stoData, setStoData)}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Real Estate">Bienes Raíces</SelectItem>
                                <SelectItem value="Infrastructure">Infraestructura</SelectItem>
                                <SelectItem value="Commodities">Materias Primas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="tokens_for_sale">Número de Tokens a la Venta</Label>
                <Input id="tokens_for_sale" name="tokens_for_sale" type="number" value={stoData.tokens_for_sale} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
                <div>
                <Label htmlFor="token_price">Precio por Token ({stoData.accepted_stablecoin})</Label>
                <Input id="token_price" name="token_price" type="number" value={stoData.token_price} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="start_date">Fecha de Inicio de la Oferta</Label>
                <Input id="start_date" name="start_date" type="datetime-local" value={stoData.start_date} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
                <div>
                <Label htmlFor="end_date">Fecha de Fin de la Oferta</Label>
                <Input id="end_date" name="end_date" type="datetime-local" value={stoData.end_date} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="min_raise_amount">Monto Mínimo de Recaudación</Label>
                <Input id="min_raise_amount" name="min_raise_amount" type="number" value={stoData.min_raise_amount} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
                <div>
                <Label htmlFor="max_raise_amount">Monto Máximo de Recaudación</Label>
                <Input id="max_raise_amount" name="max_raise_amount" type="number" value={stoData.max_raise_amount} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="min_investment">Monto Mínimo de Inversión</Label>
                <Input id="min_investment" name="min_investment" type="number" value={stoData.min_investment} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
                <div>
                <Label htmlFor="max_investment">Monto Máximo de Inversión</Label>
                <Input id="max_investment" name="max_investment" type="number" value={stoData.max_investment} onChange={(e) => handleInputChange(e, stoData, setStoData)} />
                </div>
            </div>
        </div>
      );

      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestionar STOs</CardTitle>
                <CardDescription>Crear, editar y monitorear las Ofertas de Tokens de Valor.</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) resetCreateForm(); else setIsCreateDialogOpen(true); }}>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo STO</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo STO</DialogTitle>
                    <DialogDescription>Define los parámetros para una nueva oferta pública.</DialogDescription>
                  </DialogHeader>
                  <StoForm stoData={newSto} setStoData={setNewSto} />
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleCreateSto}>Crear STO</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead className="text-right">Precio Token</TableHead>
                  <TableHead className="text-right">Recaudación Máx.</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="7" className="text-center">Cargando...</TableCell></TableRow>
                ) : (
                  stos.map(sto => (
                    <TableRow key={sto.id}>
                      <TableCell className="font-medium">{sto.digital_assets.name} ({sto.digital_assets.symbol})</TableCell>
                      <TableCell>{sto.sto_type}{sto.stock_market_category ? ` - ${sto.stock_market_category}` : ''}</TableCell>
                      <TableCell><Badge variant={sto.status === 'active' ? 'default' : 'secondary'}>{sto.status}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={sto.is_published ? 'default' : 'destructive'} className={sto.is_published ? 'bg-green-500' : ''}>
                          {sto.is_published ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${sto.token_price}</TableCell>
                      <TableCell className="text-right">${sto.max_raise_amount}</TableCell>
                       <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {sto.is_published ? (
                                    <DropdownMenuItem onClick={() => handleTogglePublish(sto)} className="text-orange-600">
                                        <EyeOff className="mr-2 h-4 w-4" /> Despublicar
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => handleTogglePublish(sto)} className="text-green-600">
                                        <Eye className="mr-2 h-4 w-4" /> Publicar
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditDialog(sto)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDeleteDialog(sto)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {editingSto && (
             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Editar STO</DialogTitle>
                    <DialogDescription>Actualiza los parámetros para {editingSto.digital_assets.name}.</DialogDescription>
                  </DialogHeader>
                  <StoForm stoData={editingSto} setStoData={setEditingSto} isEdit={true} />
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleUpdateSto}>Guardar Cambios</Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
          )}

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el STO para{' '}
                  <span className="font-bold">{stoToDelete?.digital_assets?.name}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSto} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      );
    };

    export default ManageSTOs;
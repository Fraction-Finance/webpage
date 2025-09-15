import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Trash2, Upload, Loader2 } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const PARTNER_CATEGORIES = [
      'Instituciones Financieras',
      'Socios Tecnológicos',
      'Regulación y Cumplimiento',
      'Originadores de Activos'
    ];

    const ManageEcosystemPartners = () => {
      const [partners, setPartners] = useState([]);
      const [newPartner, setNewPartner] = useState({ name: '', description: '', category: '' });
      const [logoFile, setLogoFile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const { toast } = useToast();

      const fetchPartners = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('ecosystem_partners').select('*').order('created_at', { ascending: false });
        if (error) {
          toast({ title: 'Error', description: 'No se pudieron cargar los socios.', variant: 'destructive' });
        } else {
          setPartners(data);
        }
        setLoading(false);
      }, [toast]);

      useEffect(() => {
        fetchPartners();
      }, [fetchPartners]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPartner(prev => ({ ...prev, [name]: value }));
      };

      const handleCategoryChange = (value) => {
        setNewPartner(prev => ({ ...prev, category: value }));
      };

      const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setLogoFile(e.target.files[0]);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPartner.name || !newPartner.category || !logoFile) {
          toast({ title: 'Campos requeridos', description: 'Por favor, complete el nombre, la categoría y seleccione un logo.', variant: 'destructive' });
          return;
        }

        setIsSubmitting(true);
        let logoUrl = null;

        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('partner_logos').upload(filePath, logoFile);

        if (uploadError) {
          toast({ title: 'Error de carga', description: `No se pudo subir el logo: ${uploadError.message}`, variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('partner_logos').getPublicUrl(filePath);
        logoUrl = urlData.publicUrl;

        const { error: insertError } = await supabase.from('ecosystem_partners').insert([{ ...newPartner, logo_url: logoUrl }]);

        if (insertError) {
          toast({ title: 'Error al guardar', description: `No se pudo añadir el socio: ${insertError.message}`, variant: 'destructive' });
        } else {
          toast({ title: 'Éxito', description: 'Socio añadido correctamente.' });
          setNewPartner({ name: '', description: '', category: '' });
          setLogoFile(null);
          document.getElementById('logo-upload').value = '';
          fetchPartners();
        }
        setIsSubmitting(false);
      };

      const handleDelete = async (partnerId, logoUrl) => {
        const { error: deleteError } = await supabase.from('ecosystem_partners').delete().match({ id: partnerId });

        if (deleteError) {
          toast({ title: 'Error al eliminar', description: deleteError.message, variant: 'destructive' });
          return;
        }

        if (logoUrl) {
          const logoPath = logoUrl.split('/').pop();
          await supabase.storage.from('partner_logos').remove([logoPath]);
        }

        toast({ title: 'Éxito', description: 'Socio eliminado correctamente.' });
        fetchPartners();
      };

      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestionar Socios del Ecosistema</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Añadir Nuevo Socio</CardTitle>
              <CardDescription>Completa el formulario para añadir un nuevo socio al ecosistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Socio</Label>
                    <Input id="name" name="name" value={newPartner.name} onChange={handleInputChange} placeholder="Ej: Goldman Sachs" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select onValueChange={handleCategoryChange} value={newPartner.category} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNER_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Input id="description" name="description" value={newPartner.description} onChange={handleInputChange} placeholder="Ej: Banca de Inversión" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo del Socio</Label>
                  <Input id="logo-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" required />
                  {logoFile && <p className="text-sm text-muted-foreground">Archivo seleccionado: {logoFile.name}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Añadiendo...</> : 'Añadir Socio'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Socios Existentes</CardTitle>
              <CardDescription>Lista de todos los socios actuales en el ecosistema.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map(partner => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <img src={partner.logo_url} alt={partner.name} className="h-10 w-auto object-contain" />
                        </TableCell>
                        <TableCell>{partner.name}</TableCell>
                        <TableCell>{partner.category}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente al socio y su logo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(partner.id, partner.logo_url)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!loading && partners.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No se han añadido socios todavía.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    export default ManageEcosystemPartners;
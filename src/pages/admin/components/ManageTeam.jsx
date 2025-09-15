import React, { useState, useEffect, useCallback } from 'react';
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
import { PlusCircle, Edit, Trash2, Loader2, UploadCloud, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MemberForm = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', role: '', image_url: '', ...member });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    try {
        const { error: uploadError } = await supabase.storage.from('team_avatars').upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('team_avatars').getPublicUrl(fileName);
        setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        toast({ title: "Imagen subida", description: "La imagen del miembro del equipo se ha subido." });
    } catch (error) {
        toast({ title: "Error al subir la imagen", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { id, ...dataToSave } = formData;
    
    let response;
    if (member?.id) {
      response = await supabase.from('team_members').update(dataToSave).eq('id', member.id);
    } else {
      response = await supabase.from('team_members').insert(dataToSave);
    }

    if (response.error) {
      toast({ title: 'Error', description: response.error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: `Miembro del equipo ${member?.id ? 'actualizado' : 'creado'}.` });
      onSave();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Foto de Perfil</Label>
        <div className="mt-2 flex items-center gap-4">
            <Avatar className="h-24 w-24">
                <AvatarImage src={formData.image_url} alt={formData.name} />
                <AvatarFallback><UserIcon className="h-10 w-10 text-gray-400" /></AvatarFallback>
            </Avatar>
            <div className="w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 relative flex items-center justify-center">
                <input id="file-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
                <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center text-center">
                    {isUploading ? <Loader2 className="h-6 w-6 animate-spin"/> : <><UploadCloud className="h-6 w-6 text-gray-400" /><span className="text-sm text-gray-500">Subir imagen</span></>}
                </label>
            </div>
        </div>
      </div>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} required />
      </div>
      <div>
        <Label htmlFor="role">Cargo</Label>
        <Input id="role" value={formData.role} onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))} required />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving || isUploading}>
          {(isSaving || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </DialogFooter>
    </form>
  );
};

const ManageTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setMembers(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSave = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    fetchMembers();
  };

  const handleOpenDialog = (member = null) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro del equipo?')) {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Éxito', description: 'Miembro del equipo eliminado.' });
        fetchMembers();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Gestionar Equipo</CardTitle>
            <CardDescription>Añadir, editar o eliminar miembros del equipo.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingMember(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Miembro</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Editar' : 'Añadir'} Miembro del Equipo</DialogTitle>
                <DialogDescription>Completa los detalles del miembro del equipo.</DialogDescription>
              </DialogHeader>
              <MemberForm member={editingMember} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan="4" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : members.length > 0 ? (
              members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                        <AvatarImage src={member.image_url} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(member)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan="4" className="text-center h-24">No se encontraron miembros del equipo.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageTeam;
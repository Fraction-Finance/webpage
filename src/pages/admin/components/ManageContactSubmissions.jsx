
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Loader2, Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const SubmissionDetailsDialog = ({ submission, onMarkAsRead, onRefresh }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = async (isOpen) => {
    setOpen(isOpen);
    if (isOpen && !submission.read) {
      await onMarkAsRead(submission.id);
      onRefresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detalles del Mensaje</DialogTitle>
          <DialogDescription>
            Recibido el {new Date(submission.created_at).toLocaleString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="font-semibold">Nombre:</p>
            <p>{submission.name}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <a href={`mailto:${submission.email}`} className="text-primary hover:underline">{submission.email}</a>
          </div>
          <div>
            <p className="font-semibold">Asunto:</p>
            <p>{submission.subject}</p>
          </div>
          <div>
            <p className="font-semibold">Mensaje:</p>
            <p className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm">{submission.message}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ManageContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSubmissions(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleMarkAsRead = async (id) => {
    const { error } = await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo marcar como leído.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el mensaje.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Mensaje eliminado correctamente.' });
      fetchSubmissions();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensajes de Contacto</CardTitle>
        <CardDescription>Gestiona los mensajes enviados a través del formulario de contacto.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan="6" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : submissions.length > 0 ? (
                submissions.map(submission => (
                  <TableRow key={submission.id} className={cn(!submission.read && "bg-primary/10")}>
                    <TableCell>
                      {!submission.read ? <Badge>Nuevo</Badge> : <Badge variant="secondary">Leído</Badge>}
                    </TableCell>
                    <TableCell className={cn(!submission.read && "font-bold")}>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <SubmissionDetailsDialog submission={submission} onMarkAsRead={handleMarkAsRead} onRefresh={fetchSubmissions} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el mensaje.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(submission.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan="6" className="text-center h-24">No se encontraron mensajes.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageContactSubmissions;

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las ofertas de empleo.' });
    } else {
      setJobs(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleEdit = (job) => {
    setCurrentJob(job);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentJob(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta de empleo?')) {
      const { error } = await supabase.from('job_postings').delete().eq('id', jobId);
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la oferta.' });
      } else {
        toast({ title: 'Éxito', description: 'Oferta de empleo eliminada.' });
        fetchJobs();
      }
    }
  };

  const JobForm = ({ job, onFinished }) => {
    const [formData, setFormData] = useState({
      title: job?.title || '',
      location: job?.location || '',
      type: job?.type || 'Tiempo Completo',
      description: job?.description || '',
      requirements: job?.requirements || '',
      is_active: job?.is_active ?? true,
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      const { error } = job
        ? await supabase.from('job_postings').update(formData).eq('id', job.id)
        : await supabase.from('job_postings').insert([formData]);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la oferta.' });
      } else {
        toast({ title: 'Éxito', description: `Oferta de empleo ${job ? 'actualizada' : 'creada'}.` });
        onFinished();
      }
      setSaving(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título del Puesto</Label>
            <Input id="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" value={formData.location} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <Label htmlFor="type">Tipo de Contrato</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
              <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
              <SelectItem value="Contrato">Contrato</SelectItem>
              <SelectItem value="Práctica">Práctica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="requirements">Requisitos</Label>
          <Textarea id="requirements" value={formData.requirements} onChange={handleChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} />
          <Label htmlFor="is_active">Activa</Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionar Empleos</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Oferta
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ofertas de Empleo</CardTitle>
          <CardDescription>Crea, edita y gestiona las ofertas de empleo publicadas en el sitio.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>
                      <Badge variant={job.is_active ? 'default' : 'outline'}>
                        {job.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{currentJob ? 'Editar Oferta de Empleo' : 'Crear Nueva Oferta de Empleo'}</DialogTitle>
          </DialogHeader>
          <JobForm
            job={currentJob}
            onFinished={() => {
              setIsDialogOpen(false);
              fetchJobs();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageJobs;
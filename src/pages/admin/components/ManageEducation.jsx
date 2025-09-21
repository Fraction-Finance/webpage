import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
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
import { useEducation } from '@/contexts/EducationContext';

const ManageEducation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { articles, loading, fetchAllArticles, deleteArticle } = useEducation();
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchAllArticles();
  }, [fetchAllArticles]);

  const handleDelete = async (articleId) => {
    setIsDeleting(articleId);
    try {
      await deleteArticle(articleId);
      toast({ title: 'Artículo eliminado', description: 'El artículo ha sido eliminado con éxito.' });
    } catch (error) {
      toast({ title: 'Error al eliminar el artículo', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestor de Contenido Educativo</h1>
          <p className="text-muted-foreground">Crea, edita y elimina artículos de la sección de Educación Financiera.</p>
        </div>
        <Button onClick={() => navigate('/administracion/educacion/nuevo')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nuevo Artículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos</CardTitle>
          <CardDescription>Una lista de todos los artículos educativos en tu plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Serie</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan="4" className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
              ) : articles.length > 0 ? (
                articles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.series_title}</TableCell>
                    <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/administracion/educacion/editar/${article.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" disabled={isDeleting === article.id}>
                            {isDeleting === article.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(article.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan="4" className="text-center h-24">No se encontraron artículos.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageEducation;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error al obtener las publicaciones', description: error.message, variant: 'destructive' });
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
      if (error) {
        toast({ title: 'Error al eliminar la publicación', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Publicación Eliminada', description: 'La publicación ha sido eliminada con éxito.' });
        fetchPosts();
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestor de Blog</h1>
          <p className="text-muted-foreground">Crea, edita y gestiona todas las publicaciones de tu blog.</p>
        </div>
        <Card className="p-4 flex items-center gap-4">
            <div>
                <h3 className="font-semibold">Crear Publicación de Blog</h3>
                <p className="text-sm text-muted-foreground">Escribe y publica nuevos artículos para el blog de tu plataforma.</p>
            </div>
            <Button onClick={() => navigate('/administracion/blog/nuevo')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Publicación
            </Button>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Publicaciones</CardTitle>
          <CardDescription>Una lista de todas las publicaciones del blog en tu plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan="5" className="text-center">Cargando...</TableCell></TableRow>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'No publicado'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/administracion/blog/editar/${post.id}`)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan="5" className="text-center">No se encontraron publicaciones. ¡Empieza creando una!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
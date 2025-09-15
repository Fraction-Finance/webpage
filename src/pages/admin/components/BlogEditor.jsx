import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import ReactQuill from 'react-quill';
    import { Save, ArrowLeft, UploadCloud } from 'lucide-react';
    import 'react-quill/dist/quill.snow.css';

    const Quill = ReactQuill.Quill;
    const Align = Quill.import('formats/align');
    Align.whitelist = ['left', 'center', 'right', 'justify'];
    Quill.register(Align, true);

    const Color = Quill.import('formats/color');
    const newColors = ['#0046ff', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#888888', '#555555'];
    Color.whitelist = newColors;
    Quill.register(Color, true);

    const BlogEditor = () => {
      const { postId } = useParams();
      const navigate = useNavigate();
      const { user } = useAuth();
      const { toast } = useToast();

      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');
      const [imageUrl, setImageUrl] = useState('');
      const [category, setCategory] = useState('');
      const [readTime, setReadTime] = useState('');
      const [publicationDate, setPublicationDate] = useState('');
      const [loading, setLoading] = useState(false);
      const [isUploading, setIsUploading] = useState(false);

      useEffect(() => {
        if (postId) {
          setLoading(true);
          const fetchPost = async () => {
            const { data, error } = await supabase.from('blog_posts').select('*').eq('id', postId).single();
            if (error) {
              toast({ title: 'Error al obtener la publicación', description: error.message, variant: 'destructive' });
              navigate('/administracion/blog');
            } else {
              setTitle(data.title);
              setContent(data.content);
              setImageUrl(data.image_url || '');
              setCategory(data.category || '');
              setReadTime(data.read_time || '');
              setPublicationDate(data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '');
            }
            setLoading(false);
          };
          fetchPost();
        }
      }, [postId, navigate, toast]);

      const generateSlug = (title) => {
        const baseSlug = title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const randomSuffix = Math.floor(10000 + Math.random() * 90000);
        return `${baseSlug}-${randomSuffix}`;
      };

      const handlePublish = async () => {
        setLoading(true);
        if (!title) {
          toast({ title: 'El título es obligatorio', variant: 'destructive' });
          setLoading(false);
          return;
        }

        const postData = {
          title,
          content,
          image_url: imageUrl,
          category,
          read_time: parseInt(readTime, 10) || 0,
          status: 'published',
          published_at: publicationDate ? new Date(publicationDate).toISOString() : new Date().toISOString(),
          author_id: user.id,
        };

        let response;
        if (postId) {
          response = await supabase.from('blog_posts').update(postData).eq('id', postId).select();
        } else {
          postData.slug = generateSlug(title);
          response = await supabase.from('blog_posts').insert(postData).select();
        }

        const { error } = response;
        if (error) {
          toast({ title: 'Error al publicar la entrada', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: '¡Publicación Exitosa!', description: 'Tu artículo ya está en línea.' });
          navigate('/administracion/blog');
        }
        setLoading(false);
      };
      
      const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const fileName = `${Date.now()}_${file.name}`;
        try {
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            setImageUrl(data.publicUrl);
            toast({ title: "¡Imagen Subida!", description: "La imagen se ha subido y enlazado correctamente." });
        } catch (error) {
            toast({ title: "Error al Subir la Imagen", description: error.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
      };

      const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image', 'blockquote', 'code-block'],
          [{ 'color': newColors }, { 'background': [] }],
          ['clean'],
        ],
      };
      
      if (loading && postId) return <div className="p-8 text-center">Cargando editor...</div>;

      return (
        <div className="flex flex-col h-full">
          <header className="flex justify-between items-center mb-6 pb-4 border-b">
            <Button variant="ghost" onClick={() => navigate('/administracion/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Todas las Publicaciones
            </Button>
            <h1 className="text-xl font-semibold">{postId ? 'Editar Publicación' : 'Crear Nueva Publicación'}</h1>
            <div /> 
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Input
                id="post-title"
                placeholder="Título de la Publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
              />
              <div className="flex-grow">
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-full" />
              </div>
            </div>
            
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publicar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handlePublish} disabled={loading || isUploading} className="w-full">
                      <Save className="mr-2 h-4 w-4"/>
                      {loading ? 'Publicando...' : (postId ? 'Actualizar Publicación' : 'Publicar')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Publicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="featured-image">Imagen Destacada</Label>
                    <div className="mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 relative">
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
                      <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Destacada" className="w-full h-full object-cover rounded-md"/>
                        ) : (
                          <div className="text-center">
                            <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">{isUploading ? 'Subiendo...' : 'Haz clic para subir'}</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                   <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Tecnología" className="mt-2"/>
                  </div>
                  <div>
                    <Label htmlFor="read-time">Tiempo de Lectura (minutos)</Label>
                    <Input id="read-time" type="number" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="Ej: 5" className="mt-2"/>
                  </div>
                  <div>
                    <Label htmlFor="publication-date">Fecha de Publicación</Label>
                    <Input
                      id="publication-date"
                      type="datetime-local"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className="mt-2"
                    />
                     <p className="text-xs text-muted-foreground mt-2">Dejar en blanco para usar la fecha actual.</p>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      );
    };

    export default BlogEditor;
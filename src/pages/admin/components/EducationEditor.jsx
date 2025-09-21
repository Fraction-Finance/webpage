import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, ArrowLeft, Upload, Trash2, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const EducationEditor = () => {
  const { articleId } = useParams();
  const isNew = !articleId || articleId === 'nuevo';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [article, setArticle] = useState({
    title: '',
    series_title: 'Serie 1: Fundamentos Financieros',
    series_order: 1,
    article_order: 1,
    introduction: '',
    content: '',
    qna: [],
    pdf_url: '',
    video_url: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const seriesOptions = [
    { title: "Serie 1: Fundamentos Financieros", order: 1 },
    { title: "Serie 2: Tokenización y Activos Digitales", order: 2 },
    { title: "Serie 3: Construyendo tu Portafolio Diversificado", order: 3 },
    { title: "Serie 4: Regulación, Seguridad y Confianza", order: 4 },
    { title: "Serie 5: Estrategias Avanzadas", order: 5 },
  ];

  const fetchArticle = useCallback(async () => {
    if (isNew || !articleId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('education_articles')
      .select('*')
      .eq('id', articleId)
      .single();

    if (error) {
      toast({ title: 'Error al cargar el artículo', description: error.message, variant: 'destructive' });
      navigate('/administracion/educacion');
    } else if (data) {
      setArticle({
        ...data,
        qna: data.qna || [],
      });
    }
    setLoading(false);
  }, [articleId, isNew, navigate, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setArticle(prev => ({ ...prev, [id]: type === 'number' ? parseInt(value, 10) : value }));
  };

  const handleSeriesChange = (value) => {
    const selectedSeries = seriesOptions.find(s => s.title === value);
    setArticle(prev => ({ 
      ...prev, 
      series_title: value,
      series_order: selectedSeries ? selectedSeries.order : prev.series_order
    }));
  };

  const handleContentChange = (value) => {
    setArticle(prev => ({ ...prev, content: value }));
  };

  const handleQnaChange = (index, field, value) => {
    const newQna = [...article.qna];
    newQna[index][field] = value;
    setArticle(prev => ({ ...prev, qna: newQna }));
  };

  const addQnaItem = () => {
    setArticle(prev => ({ ...prev, qna: [...prev.qna, { q: '', a: '' }] }));
  };

  const removeQnaItem = (index) => {
    const newQna = article.qna.filter((_, i) => i !== index);
    setArticle(prev => ({ ...prev, qna: newQna }));
  };

  const handlePdfUpload = async (event) => {
    if (isNew) {
      toast({ title: "Guarda primero", description: "Debes guardar el artículo antes de subir archivos.", variant: "destructive" });
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingPdf(true);
    const fileName = `education_pdfs/${articleId}/${Date.now()}_${file.name}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('public-assets').getPublicUrl(fileName);
      setArticle(prev => ({ ...prev, pdf_url: data.publicUrl }));
      toast({ title: "PDF Subido", description: "El archivo PDF se ha subido y enlazado." });
    } catch (error) {
      toast({ title: "Error al subir PDF", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const articleData = {
      ...article,
      slug: article.slug || generateSlug(article.title),
    };
    
    let response;
    if (isNew) {
      response = await supabase.from('education_articles').insert(articleData).select().single();
    } else {
      response = await supabase.from('education_articles').update(articleData).eq('id', articleId).select().single();
    }

    const { data, error } = response;

    if (error) {
      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Artículo guardado', description: 'Los cambios se han guardado con éxito.' });
      if (isNew && data) {
        navigate(`/administracion/educacion/editar/${data.id}`);
      } else {
        fetchArticle();
      }
    }
    setIsSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando editor...</div>;
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/administracion/educacion')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? 'Crear Nuevo Artículo' : 'Editar Artículo'}</h1>
        <Button onClick={handleSave} disabled={isSaving || isUploadingPdf}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Contenido Principal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={article.title} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Serie</Label>
                  <Select value={article.series_title} onValueChange={handleSeriesChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una serie" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesOptions.map(option => (
                        <SelectItem key={option.title} value={option.title}>{option.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="series_order">Orden Serie</Label>
                        <Input id="series_order" type="number" value={article.series_order} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="article_order">Orden Artículo</Label>
                        <Input id="article_order" type="number" value={article.article_order} onChange={handleInputChange} />
                    </div>
                </div>
              </div>
              <div>
                <Label htmlFor="introduction">Introducción</Label>
                <Textarea id="introduction" value={article.introduction} onChange={handleInputChange} rows={3} />
              </div>
              <div>
                <Label>Contenido Completo</Label>
                <ReactQuill theme="snow" value={article.content} onChange={handleContentChange} modules={modules} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Preguntas y Respuestas (Q&A)</CardTitle>
                <Button size="sm" variant="outline" onClick={addQnaItem}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.qna.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeQnaItem(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div>
                    <Label htmlFor={`qna-q-${index}`}>Pregunta</Label>
                    <Input id={`qna-q-${index}`} value={item.q} onChange={(e) => handleQnaChange(index, 'q', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor={`qna-a-${index}`}>Respuesta</Label>
                    <Textarea id={`qna-a-${index}`} value={item.a} onChange={(e) => handleQnaChange(index, 'a', e.target.value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Recursos Adicionales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pdf_url">PDF Informativo</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input id="pdf_url" value={article.pdf_url || ''} disabled placeholder="URL del PDF subido" />
                  <Button asChild variant="outline" size="icon">
                    <label htmlFor="pdf-upload">
                      <Upload className="h-4 w-4" />
                      <input id="pdf-upload" type="file" className="sr-only" accept=".pdf" onChange={handlePdfUpload} disabled={isUploadingPdf || isNew} />
                    </label>
                  </Button>
                </div>
                {isUploadingPdf && <p className="text-sm text-muted-foreground mt-1">Subiendo PDF...</p>}
                {isNew && <p className="text-xs text-muted-foreground mt-1">Guarda el artículo para poder subir un PDF.</p>}
              </div>
              <div>
                <Label htmlFor="video_url">URL del Video Explicativo</Label>
                <Input id="video_url" value={article.video_url || ''} onChange={handleInputChange} placeholder="https://youtube.com/..." />
                <p className="text-xs text-muted-foreground mt-1">Pega la URL de un video de YouTube o Vimeo.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducationEditor;
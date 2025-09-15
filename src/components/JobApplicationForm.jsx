import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud, FileText, Trash2 } from 'lucide-react';

const JobApplicationForm = ({ job, onFinished }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cover_letter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast({
        variant: 'destructive',
        title: 'Falta el currículum',
        description: 'Por favor, sube tu currículum para postular.',
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload resume to Supabase Storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 3. Insert application data into the database
      const applicationData = {
        job_id: job.id,
        name: formData.name,
        email: formData.email,
        cover_letter: formData.cover_letter,
        resume_url: publicUrl,
      };

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([applicationData]);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: '¡Postulación Enviada!',
        description: `Tu postulación para ${job.title} ha sido recibida.`,
      });
      onFinished();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar la postulación',
        description: error.message || 'Por favor, inténtalo de nuevo más tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre Completo</Label>
        <Input id="name" value={formData.name} onChange={handleInputChange} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cover_letter">Carta de Presentación (Opcional)</Label>
        <Textarea id="cover_letter" value={formData.cover_letter} onChange={handleInputChange} placeholder="Cuéntanos por qué eres el candidato ideal..." />
      </div>
      <div className="grid gap-2">
        <Label>Currículum (CV)</Label>
        {resumeFile ? (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm truncate max-w-[200px]">{resumeFile.name}</span>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setResumeFile(null)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Input id="resume" type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" required />
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-50">
              <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Haz clic para subir tu CV</span>
              <span className="text-xs text-gray-500">PDF, DOC, DOCX (Máx 5MB)</span>
            </div>
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Enviando...' : 'Enviar Postulación'}
      </Button>
    </form>
  );
};

export default JobApplicationForm;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import JobApplicationForm from '@/components/JobApplicationForm';

const JobCard = ({ job, index }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Card className="glass-effect h-full flex flex-col">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 pt-2">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.type}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-700 line-clamp-3">{job.description}</p>
          </CardContent>
          <CardFooter>
            <DialogTrigger asChild>
              <Button className="w-full">
                Postular Ahora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
          </CardFooter>
        </Card>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Postular a: {job.title}</DialogTitle>
          </DialogHeader>
          <JobApplicationForm job={job} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job postings:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Trabaja con Nosotros | Fraction Finance</title>
        <meta name="description" content="Únete a nuestro equipo y ayúdanos a construir el futuro de las finanzas. Explora nuestras oportunidades de empleo." />
      </Helmet>
      <div className="pt-24 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12 mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="gradient-text">Trabaja con Nosotros</span>
            </h1>
            <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
              Estamos construyendo un equipo de personas apasionadas y con talento para revolucionar los mercados de capitales. ¿Listo para unirte a la misión?
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-gray-500 glass-effect rounded-lg"
            >
              <p className="text-2xl font-semibold">No hay vacantes disponibles en este momento.</p>
              <p className="mt-2">Vuelve a consultar pronto o envíanos tu CV a nuestro correo de contacto.</p>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Careers;
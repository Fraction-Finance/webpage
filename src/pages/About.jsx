import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, Target, Rocket, Globe, ArrowRight, Lightbulb, TrendingUp, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('team_members').select('*').order('created_at', {
        ascending: true
      });
      if (error) {
        console.error("Error fetching team members:", error);
      } else {
        setTeamMembers(data);
      }
      setLoading(false);
    };
    fetchTeamMembers();
  }, []);
  const values = [{
    icon: Users,
    title: 'Democratizar el Acceso',
    description: 'Rompemos barreras para que los mercados de capitales sean accesibles para todos, en todas partes.'
  }, {
    icon: Target,
    title: 'Impulsar la Innovación',
    description: 'Somos pioneros, aprovechando la tecnología de vanguardia para redefinir los servicios financieros.'
  }, {
    icon: Rocket,
    title: 'Potenciar el Crecimiento',
    description: 'Proporcionamos las herramientas e infraestructura para que las empresas y los inversores prosperen.'
  }, {
    icon: Globe,
    title: 'Fomentar la Transparencia',
    description: 'Creemos en el poder de los mercados abiertos y transparentes, construidos sobre la confianza y la integridad.'
  }];
  return <>
      <Helmet>
        <title>Nuestra Empresa | Fraction Finance</title>
        <meta name="description" content="Somos un equipo de expertos financieros, tecnólogos e innovadores dedicados a crear un sistema financiero global más abierto, eficiente y accesible." />
        <meta property="og:title" content="Nuestra Empresa" />
        <meta property="og:description" content="Somos un equipo de expertos financieros, tecnólogos e innovadores dedicados a crear un sistema financiero global más abierto, eficiente y accesible." />
      </Helmet>

      <div className="pt-20">
        <section className="py-24 hero-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
              <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mb-8">
                💡 Nuestra Visión
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-gray-900">Construyendo el Futuro</span>
                <br />
                <span className="gradient-text">de los Mercados de Capitales</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-4">
                Somos un equipo de expertos financieros, tecnólogos e innovadores dedicados a crear un sistema financiero global más abierto, eficiente y accesible.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8
            }} className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/70 shadow-lg">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <Lightbulb className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
                        <p className="text-lg text-gray-700 max-w-md">Cambiar la forma de invertir en activos financieros, simple, segura y accesible para todos</p>
                    </motion.div>
                    <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/70 shadow-lg">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <TrendingUp className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
                        <p className="text-lg text-gray-700 max-w-md">Convertirnos en la plataforma referente de tokenización y finanzas descentralizadas, facilitando inversiones seguras, accesibles y globales.</p>
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8
            }}>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  <span className="gradient-text">Principios Fundamentales que nos Impulsan</span>
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Nuestros valores son la base de nuestra cultura y guían cada decisión que tomamos. Definen quiénes somos y cómo operamos.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {values.map((value, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="glass-effect p-8 rounded-2xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-cyan-100 w-fit mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </motion.div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Nuestro Enfoque Innovador
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                        Hemos diseñado un modelo de negocio transparente y sostenible que alinea nuestro éxito con el de nuestros clientes. Descubre cómo estamos creando valor en el ecosistema de activos digitales.
                    </p>
                    <Link to="/nosotros/modelo-de-negocio">
                        <Button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white font-semibold rounded-full shadow-lg">
                            Explora Nuestro Modelo de Negocio
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Conoce a la Fuerza Impulsora
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Nuestro equipo de liderazgo reúne décadas de experiencia en los sectores financiero, tecnológico y regulatorio.
              </p>
            </motion.div>
            <div className="flex justify-center">
                {loading ? <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl">
                        {teamMembers.map((member, index) => <motion.div key={member.id} initial={{
                opacity: 0,
                scale: 0.9
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="text-center group">
                                <div className="relative w-40 h-40 mx-auto mb-4">
                                     <Avatar className="w-full h-full object-cover shadow-lg">
                                        <AvatarImage src={member.image_url} alt={`${member.name}, ${member.role}`} />
                                        <AvatarFallback>
                                            <User className="h-12 w-12 text-gray-400" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300"></div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                <p className="text-primary font-medium">{member.role}</p>
                            </motion.div>)}
                    </div>}
            </div>
          </div>
        </section>
      </div>
    </>;
};
export default About;
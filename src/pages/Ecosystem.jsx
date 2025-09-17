import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Network, Building2, Shield, Briefcase, Globe, Loader2, Droplet, Scale, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const PartnerNetworkGraph = lazy(() => import('@/components/ecosystem/PartnerNetworkGraph'));

const categoryIcons = {
  'Instituciones Financieras': Building2,
  'Socios Tecnológicos': Network,
  'Regulación y Cumplimiento': Shield,
  'Originadores de Activos': Briefcase
};

const Ecosystem = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ecosystem_partners')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching partners:', error);
      } else {
        const groupedPartners = data.reduce((acc, partner) => {
          const category = partner.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(partner);
          return acc;
        }, {});
        setPartners(groupedPartners);
      }
      setLoading(false);
    };
    fetchPartners();
  }, []);

  const handlePartnerClick = () => {
    navigate('/nosotros/contacto');
  };

  const benefits = [
    { title: 'Alcance Global', description: 'Acceso a una red de inversores institucionales y gestores de activos', icon: Globe },
    { title: 'Pozo de Liquidez', description: 'Profunda liquidez a través de un mercado integrado y centros de negociación', icon: Droplet },
    { title: 'Red de Cumplimiento', description: 'Cumplimiento automatizado en múltiples jurisdicciones y regulaciones', icon: Scale },
    { title: 'Pila Tecnológica', description: 'La mejor infraestructura de su clase de socios líderes en blockchain y fintech', icon: Wrench }
  ];

  return (
    <>
      <Helmet>
        <title>Ecosistema de Innovación | Fraction Finance</title>
        <meta name="description" content="Únete a un próspero ecosistema de instituciones financieras, socios tecnológicos y expertos regulatorios que transforman el futuro de los mercados de capitales." />
        <meta property="og:title" content="Ecosistema de Innovación" />
        <meta property="og:description" content="Únete a un próspero ecosistema de instituciones financieras, socios tecnológicos y expertos regulatorios que transforman el futuro de los mercados de capitales." />
      </Helmet>

      <div className="pt-16">
        <section className="py-20 hero-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-primary mb-8">
                🤝 Red Global de Socios
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gray-900">Ecosistema de Innovación</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Únete a un próspero ecosistema de instituciones financieras, socios tecnológicos y expertos regulatorios que transforman el futuro de los mercados de capitales.
              </p>
              <Button onClick={handlePartnerClick} size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg glow-effect">
                Conviértete en Socio
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Red de Socios
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Colaborando con líderes de la industria en finanzas, tecnología y cumplimiento.
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(partners).map(([category, partnerList], categoryIndex) => {
                  const Icon = categoryIcons[category] || Globe;
                  return (
                    <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: categoryIndex * 0.1 }} className="glass-effect p-8 rounded-2xl">
                      <div className="flex items-center mb-6">
                        <div className="p-3 rounded-xl bg-primary/10 mr-4">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {partnerList.map((partner, partnerIndex) => (
                          <motion.div key={partner.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: partnerIndex * 0.05 }} className="bg-white/70 p-4 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center" onClick={handlePartnerClick}>
                            <img src={partner.logo_url} alt={`${partner.name} logo`} className="h-16 w-32 object-contain mb-4" />
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm">
                              {partner.name}
                            </h4>
                            {partner.description && <p className="text-xs text-gray-600 mt-1">{partner.description}</p>}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 glass-effect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Beneficios del Ecosistema
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Aprovecha la fuerza colectiva de nuestra red de socios.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Únete a Nuestra Red de Socios
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Ya seas una institución financiera, un proveedor de tecnología o un socio de servicios, descubre cómo la colaboración puede desbloquear nuevas oportunidades en los mercados de activos digitales.
                </p>
                <div className="space-y-4 mb-8">
                  {['Acceso a una red de inversores', 'Oportunidades de reparto de ingresos', 'Soporte de integración técnica', 'Co-marketing y desarrollo de negocios'].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-4"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handlePartnerClick} size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg">Conviértete en Socio</Button>
                </div>
              </motion.div>

              <div className="min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
                <Suspense fallback={<div className="flex justify-center items-center w-full h-full"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
                  <PartnerNetworkGraph />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Ecosystem;
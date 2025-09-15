import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MapPin } from 'lucide-react';
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubjectChange = value => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    toast({
      title: "¡Mensaje Enviado!",
      description: "Hemos recibido tu mensaje y te responderemos en breve."
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  const subjectOptions = [{
    value: 'consulta_general',
    label: 'Consulta General'
  }, {
    value: 'ser_socio',
    label: 'Convertirse en Socio'
  }, {
    value: 'soporte_tecnico',
    label: 'Soporte Técnico'
  }, {
    value: 'prensa',
    label: 'Prensa y Medios'
  }, {
    value: 'otro',
    label: 'Otro'
  }];
  return <>
                <Helmet>
                    <title>Contacto | Fraction Finance</title>
                    <meta name="description" content="¡Estamos aquí para ayudar! Contáctanos para cualquier pregunta o soporte." />
                </Helmet>
                <div className="pt-24 sm:pt-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                                <span className="gradient-text">Contáctanos</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                                ¡Estamos aquí para ayudar! Contáctanos para cualquier pregunta o soporte.
                            </p>
                        </motion.div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="glass-effect-custom p-8 rounded-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="name">Tu Nombre</Label>
                                        <Input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Tu Email</Label>
                                        <Input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="subject">Asunto</Label>
                                        <Select onValueChange={handleSubjectChange} value={formData.subject} name="subject">
                                            <SelectTrigger className="w-full mt-1">
                                                <SelectValue placeholder="Selecciona un asunto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjectOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Mensaje</Label>
                                        <Textarea name="message" id="message" rows="4" value={formData.message} onChange={handleInputChange} required className="mt-1"></Textarea>
                                    </div>
                                    <Button type="submit" className="w-full glow-effect">Enviar Mensaje</Button>
                                </form>
                            </motion.div>

                            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="space-y-8">
                                <div className="glass-effect-custom p-8 rounded-lg">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <div className="flex items-center">
                                            <Mail className="h-6 w-6 text-primary mr-4" />
                                            <a href="mailto:contacto@fractionfinance.cl" className="hover:text-primary transition-colors">contacto@fractionfinance.cl</a>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                                            <span>Antonio Bellet N°130, Oficina 1210<br />Providencia, Santiago</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </>;
};
export default Contact;
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

const questions = [
  {
    id: 'q1_investment_horizon',
    text: '1. Horizonte de inversión: ¿Cuánto tiempo planeas mantener tu inversión?',
    options: [
      { value: 'a', label: 'Menos de 1 año.' },
      { value: 'b', label: '1 a 3 años.' },
      { value: 'c', label: '3 a 5 años.' },
      { value: 'd', label: 'Más de 5 años.' },
    ],
  },
  {
    id: 'q2_investment_objective',
    text: '2. Objetivo principal de inversión: ¿Qué esperas lograr con tus inversiones?',
    options: [
      { value: 'a', label: 'Mantener el valor de mi dinero (preservación).' },
      { value: 'b', label: 'Generar ingresos periódicos.' },
      { value: 'c', label: 'Hacer crecer mi capital en el mediano plazo.' },
      { value: 'd', label: 'Maximizar rentabilidad en el largo plazo.' },
    ],
  },
  {
    id: 'q3_liquidity_need',
    text: '3. Liquidez: ¿Qué tan importante es poder retirar tu dinero en cualquier momento?',
    options: [
      { value: 'a', label: 'Muy importante (quiero disponibilidad inmediata).' },
      { value: 'b', label: 'Moderadamente importante.' },
      { value: 'c', label: 'Poco importante, puedo dejarlo bloqueado varios años.' },
    ],
  },
  {
    id: 'q4_financial_experience',
    text: '4. Experiencia y conocimientos financieros: ¿Cómo evaluarías tu experiencia?',
    options: [
      { value: 'a', label: 'Nula (solo ahorro tradicional).' },
      { value: 'b', label: 'Básica (depósitos, fondos mutuos simples).' },
      { value: 'c', label: 'Media (acciones, ETFs, bonos).' },
      { value: 'd', label: 'Avanzada (trading, criptomonedas, derivados, RWA).' },
    ],
  },
  {
    id: 'q5_loss_reaction',
    text: '5. Reacción ante pérdidas: Si tu inversión baja un 20% en 3 meses, ¿qué harías?',
    options: [
      { value: 'a', label: 'Vendería inmediatamente para evitar más pérdidas.' },
      { value: 'b', label: 'Esperaría hasta que se recupere.' },
      { value: 'c', label: 'Mantendría y evaluaría nuevas oportunidades.' },
      { value: 'd', label: 'Compraría más porque veo oportunidad.' },
    ],
  },
  {
    id: 'q6_income_proportion',
    text: '6. Ingreso y situación financiera: ¿Qué proporción de tus ingresos destinas a invertir?',
    options: [
      { value: 'a', label: 'Menos del 10%.' },
      { value: 'b', label: 'Entre 10% y 25%.' },
      { value: 'c', label: 'Entre 25% y 50%.' },
      { value: 'd', label: 'Más del 50%.' },
    ],
  },
  {
    id: 'q7_risk_tolerance',
    text: '7. Tolerancia al riesgo: ¿Cuál de estas frases refleja mejor tu visión?',
    options: [
      { value: 'a', label: 'Prefiero baja rentabilidad con seguridad.' },
      { value: 'b', label: 'Acepto cierta volatilidad por mejor rendimiento.' },
      { value: 'c', label: 'Busco buenas oportunidades aunque impliquen riesgo.' },
      { value: 'd', label: 'Estoy dispuesto a arriesgar mucho por alta rentabilidad.' },
    ],
  },
  {
    id: 'q8_hypothetical_distribution',
    text: '8. Distribución hipotética: Si inviertes 10,000 USDC, ¿cómo lo distribuirías?',
    options: [
      { value: 'a', label: '90% en activos estables, 10% en riesgosos.' },
      { value: 'b', label: '70% en estables, 30% en riesgosos.' },
      { value: 'c', label: '50% en estables, 50% en riesgosos.' },
      { value: 'd', label: '20% en estables, 80% en riesgosos.' },
    ],
  },
  {
    id: 'q9_investment_style',
    text: '9. Estilo de inversión preferido',
    options: [
      { value: 'a', label: 'Conservador: priorizo seguridad y liquidez.' },
      { value: 'b', label: 'Moderado: equilibrio entre crecimiento y seguridad.' },
      { value: 'c', label: 'Dinámico: acepto volatilidad por más retorno.' },
      { value: 'd', label: 'Agresivo: busco máximo crecimiento a largo plazo.' },
    ],
  },
];

const InvestmentProfile = () => {
    const { user, profile, loading: authLoading, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (profile) {
            const initialAnswers = questions.reduce((acc, q) => {
                acc[q.id] = profile[q.id] || '';
                return acc;
            }, {});
            setAnswers(initialAnswers);
        }
    }, [profile]);
    
    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateProfile = () => {
        const counts = { a: 0, b: 0, c: 0, d: 0 };
        Object.values(answers).forEach(answer => {
            if (counts.hasOwnProperty(answer)) {
                counts[answer]++;
            } else if (answer === 'c' && !counts.d) { // Specific case for Q3
                counts.c++;
            }
        });

        // Handle Q3 where C is the highest risk
        if (answers.q3_liquidity_need === 'c') {
            counts.d +=1; // Treat Q3's 'c' as a 'd' for risk scoring
        }

        const majority = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

        switch (majority) {
            case 'a': return 'Conservador';
            case 'b': return 'Moderado';
            case 'c': return 'Dinámico';
            case 'd': return 'Agresivo';
            default: return 'Moderado';
        }
    };
    
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        const allAnswered = questions.every(q => answers[q.id]);
        if (!allAnswered) {
             toast({
                variant: "destructive",
                title: "Formulario Incompleto",
                description: "Por favor, responde todas las preguntas antes de guardar.",
            });
            return;
        }

        setLoading(true);

        const investorProfileResult = calculateProfile();

        const updates = {
            id: user.id,
            ...answers,
            investor_profile_result: investorProfileResult,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error al actualizar el perfil de inversión",
                description: error.message,
            });
        } else {
            toast({
                title: "Perfil de Inversión Actualizado",
                description: `¡Tu perfil ha sido determinado como: ${investorProfileResult}!`,
            });
            await refreshProfile();
        }
        setLoading(false);
    };

    if (authLoading && !profile) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const renderRadioGroup = (question) => (
        <div key={question.id}>
            <Label className="text-base font-semibold">{question.text}</Label>
            <RadioGroup value={answers[question.id] || ''} onValueChange={(value) => handleAnswerChange(question.id, value)} className="mt-2 space-y-2">
                {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`} className="font-normal">{option.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>Test de Perfil de Inversión</CardTitle>
                <CardDescription>
                    Responde a las siguientes preguntas para determinar tu perfil de inversionista. Esto nos ayuda a recomendarte las mejores oportunidades.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {questions.map(q => renderRadioGroup(q))}
                    
                    <div className="flex justify-end items-center pt-4 gap-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4"/>
                                    Realizar Test Nuevamente
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        <AlertTriangle className="inline-block mr-2 text-yellow-500" />
                                        ¿Estás seguro de que deseas rehacer el test?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cambiar tu perfil de inversionista puede afectar las recomendaciones de inversión que recibes y alterar tu estrategia de inversión. Asegúrate de responder con sinceridad para que tu perfil refleje con precisión tu tolerancia al riesgo y tus objetivos actuales.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleSubmit()}>Continuar y Guardar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button type="submit" disabled={loading} size="lg">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Calculando y Guardando..." : "Guardar y Calcular Perfil"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default InvestmentProfile;
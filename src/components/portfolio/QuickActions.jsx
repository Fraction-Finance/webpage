import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Minus, FileText, ArrowRight } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <Card className="glass-effect flex-grow">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <Button variant="outline" className="justify-start">
            <Plus className="mr-2 h-4 w-4" /> Depositar Fondos
          </Button>
          <Button variant="outline" className="justify-start">
            <Minus className="mr-2 h-4 w-4" /> Retirar Fondos
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" /> Generar Reporte
          </Button>
        </CardContent>
      </Card>
      
      <Card className="glass-effect bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="gradient-text">Descubre Oportunidades</CardTitle>
          <CardDescription>Explora nuevos activos para diversificar tu portafolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow">
            <Link to="/plataforma">
              Explorar Plataforma <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
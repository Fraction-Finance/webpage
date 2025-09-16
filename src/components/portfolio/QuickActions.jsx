
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { FileText, ArrowRight, Info } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const QuickActions = () => {
      const { toast } = useToast();

      const handleNotImplemented = () => {
        toast({
          title: "🚧 ¡Función en desarrollo!",
          description: "Esta característica aún no está implementada. ¡Vuelve pronto!",
        });
      };

      return (
        <div className="space-y-8 h-full flex flex-col">
          <Card className="glass-effect flex-grow">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Button variant="outline" className="justify-start" onClick={handleNotImplemented}>
                <FileText className="mr-2 h-4 w-4" /> Generar Reporte
              </Button>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Aviso de No Custodia</h4>
                    <p className="text-sm text-yellow-700">
                      No ofrecemos opciones de depósito o retiro de FIAT, ya que no custodiamos fondos. Todas las transacciones se realizan a través de tu wallet personal.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader>
              <CardTitle className="gradient-text">Descubre Oportunidades</CardTitle>
              <CardDescription>Explora nuevos activos para diversificar tu portafolio.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow justify-between">
                <Link to="/plataforma">
                  Explorar Mercado de Activos Digitales <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <Link to="/mercado-rwa">
                  Explora Oportunidades RWA <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="w-full justify-between" variant="outline">
                <Link to="/plataforma-defi">
                  Explorar Mercado de Activos DeFi <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    };

    export default QuickActions;
  
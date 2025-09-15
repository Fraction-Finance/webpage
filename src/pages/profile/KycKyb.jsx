import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const KycKyb = () => {
    const { profile, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const isInstitutional = profile?.account_type === 'institutional';
    const verificationType = isInstitutional ? 'Verificación KYB' : 'Verificación KYC';

    const handleStartVerification = () => {
        toast({
            title: "🚧 ¡Esta función aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
        });
    };

    if (authLoading && !profile) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const verificationStatus = 'not_started'; 

    const renderContentByStatus = () => {
        switch (verificationStatus) {
            case 'verified':
                return (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-green-800">Verificación Completa</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Tu cuenta ha sido verificada con éxito. Ahora tienes acceso completo a las funciones de nuestra plataforma.
                        </AlertDescription>
                    </Alert>
                );
            case 'in_progress':
                return (
                    <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                        <AlertTitle className="text-blue-800">Verificación en Progreso</AlertTitle>
                        <AlertDescription className="text-blue-700">
                            Estamos revisando tus documentos. Este proceso suele tardar de 1 a 2 días hábiles. Te notificaremos por correo electrónico una vez que se complete.
                        </AlertDescription>
                    </Alert>
                );
            case 'rejected':
                return (
                     <Alert variant="destructive">
                        <ShieldAlert className="h-5 w-5" />
                        <AlertTitle>Verificación Requerida</AlertTitle>
                        <AlertDescription>
                            Hubo un problema con tu envío anterior. Revisa tu información y vuelve a intentarlo. Contacta a soporte si necesitas ayuda.
                            <Button onClick={handleStartVerification} className="mt-4 w-full">Reenviar Documentos</Button>
                        </AlertDescription>
                    </Alert>
                );
            case 'not_started':
            default:
                 return (
                    <>
                        <p className="text-gray-600 mb-6">
                            Para cumplir con las regulaciones financieras y garantizar la seguridad de nuestra plataforma, necesitamos verificar tu identidad. Por favor, inicia el proceso de {verificationType}.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Se te pedirá que proporciones:</p>
                        <ul className="list-disc list-inside text-sm text-gray-500 mb-6 space-y-1">
                            <li>Una identificación con foto emitida por el gobierno (Pasaporte, Licencia de Conducir)</li>
                            <li>Comprobante de domicilio (por ejemplo, una factura de servicios públicos)</li>
                            {isInstitutional && <li>Documentos de registro de la empresa</li>}
                        </ul>
                        <Button onClick={handleStartVerification} size="lg" className="w-full">
                            Iniciar Proceso de Verificación
                        </Button>
                    </>
                );
        }
    };

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle>{verificationType}</CardTitle>
                <CardDescription>
                    Asegura tu cuenta y desbloquea todas las funciones completando el proceso de verificación de identidad.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContentByStatus()}
            </CardContent>
        </Card>
    );
};

export default KycKyb;
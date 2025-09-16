
    import React, { useState, useEffect } from 'react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";

    const DevelopmentNotice = () => {
      const [visible, setVisible] = useState(false);

      useEffect(() => {
        const noticeDismissed = sessionStorage.getItem('devNoticeDismissed');
        if (!noticeDismissed) {
          setVisible(true);
        }
      }, []);

      const handleDismiss = () => {
        sessionStorage.setItem('devNoticeDismissed', 'true');
        setVisible(false);
      };

      return (
        <AlertDialog open={visible} onOpenChange={setVisible}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aviso de Contenido Referencial</AlertDialogTitle>
              <AlertDialogDescription className="text-justify">
                Este sitio web se encuentra en fase de desarrollo. La información publicada tiene carácter meramente informativo y no constituye una oferta, recomendación ni representación definitiva de los productos o servicios de Fraction Finance. Fraction Finance se encuentra actualmente en proceso de aprobación y regulación ante la Comisión para el Mercado Financiero (CMF). El contenido está sujeto a cambios sin previo aviso y no corresponde a la versión final de la plataforma.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDismiss}>Entendido</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default DevelopmentNotice;
  
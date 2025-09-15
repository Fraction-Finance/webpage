import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AssetDetails = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Detalles del Activo</CardTitle>
          <CardDescription>
            Aquí encontrarás un desglose detallado de todos los activos en tu portafolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              El contenido detallado de los activos se implementará aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetDetails;
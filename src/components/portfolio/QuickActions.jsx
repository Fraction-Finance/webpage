import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="glass-effect bg-gradient-to-br from-blue-50 to-indigo-100 flex-grow">
        <CardHeader>
          <CardTitle className="gradient-text">Descubre Oportunidades</CardTitle>
          <CardDescription>Diversifica tu portafolio.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full">
          <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow justify-between">
            <Link to="/mercados">
              Explorar Mercado <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
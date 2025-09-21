import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="glass-effect bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 flex-grow flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="gradient-text">Descubre Oportunidades</CardTitle>
          </div>
          <CardDescription>Diversifica tu portafolio explorando nuevos activos.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center flex-grow">
          <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow justify-between text-base py-6">
            <Link to="/mercados">
              Explorar Mercado
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
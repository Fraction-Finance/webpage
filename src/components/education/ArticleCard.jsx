import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { ArrowRight } from 'lucide-react';
    
    const ArticleCard = ({ article }) => {
      const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
        hover: {
          scale: 1.03,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.3 }
        }
      };
    
      return (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="h-full"
        >
          <Card className="h-full flex flex-col glass-effect overflow-hidden">
            <CardHeader>
              <CardTitle className="gradient-text text-xl h-16">{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{article.introduction}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="p-0">
                <Link to={`/nosotros/educacion-financiera/${article.slug}`}>
                  Leer más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    
    export default ArticleCard;
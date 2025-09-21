import React from 'react';
    import {
      Accordion,
      AccordionContent,
      AccordionItem,
      AccordionTrigger,
    } from "@/components/ui/accordion";
    
    const QandA = ({ questions }) => {
      if (!questions || questions.length === 0) {
        return null;
      }
    
      return (
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    };
    
    export default QandA;
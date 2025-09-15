import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DocsHero = () => {
  const { toast } = useToast();

  const handleDocClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium text-blue-400 mb-8">
            📚 Developer Resources
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Documentation</span>
            <br />
            <span className="text-white">& Guides</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to integrate and build with our digital asset 
            tokenization platform. From quick starts to advanced implementations.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="glass-effect rounded-full p-2 flex items-center">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-3"
                onClick={handleDocClick}
              />
              <Button 
                onClick={handleDocClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-medium"
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DocsHero;
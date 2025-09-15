import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DocsCta = () => {
  const { toast } = useToast();

  const handleDocClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Need <span className="gradient-text">Help</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our developer support team is here to help you succeed. 
            Get personalized assistance with your integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleDocClick}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg pulse-glow"
            >
              Contact Support
            </Button>
            <Button 
              onClick={handleDocClick}
              variant="outline" 
              size="lg"
              className="glass-effect border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg"
            >
              Join Community
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DocsCta;
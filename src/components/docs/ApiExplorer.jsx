import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ApiExplorer = () => {
  const { toast } = useToast();

  const handleDocClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-fit mb-6">
              <Code className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Interactive</span>
              <br />
              <span className="text-white">API Explorer</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Test our APIs directly in your browser with our interactive explorer. 
              No setup required - just authenticate and start making calls.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Real-time API testing",
                "Code generation in multiple languages",
                "Response validation and debugging",
                "Authentication sandbox"
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-4"></div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleDocClick}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg"
            >
              Try API Explorer
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-effect p-6 rounded-2xl">
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">POST /api/v1/tokens</div>
                <div className="text-gray-400 mb-4">Content-Type: application/json</div>
                <div className="text-blue-400">
                  {`{
  "name": "Real Estate Token",
  "symbol": "RET",
  "totalSupply": 1000000,
  "assetType": "real_estate",
  "compliance": {
    "kyc": true,
    "accredited": true
  }
}`}
                </div>
              </div>
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-green-400 text-sm font-medium mb-2">Response: 201 Created</div>
                <div className="text-green-300 text-xs font-mono">
                  Token created successfully
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 floating-animation">
              <div className="glass-effect p-4 rounded-xl">
                <Book className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApiExplorer;
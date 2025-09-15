import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Shield, Globe, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { categories, documentation } from '@/data/docsData';

const iconMap = {
  Zap: Zap,
  Code: Code,
  Shield: Shield,
  Globe: Globe,
};

const DocCategories = ({ activeCategory, setActiveCategory }) => {
  const { toast } = useToast();

  const handleDocClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-effect p-6 rounded-2xl sticky top-24"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">{category.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="gradient-text">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </span>
                </h2>
                <p className="text-gray-300">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentation[activeCategory]?.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="glass-effect p-6 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    onClick={handleDocClick}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.type === 'guide' ? 'bg-blue-500/20 text-blue-400' :
                        doc.type === 'tutorial' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {doc.type}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {doc.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4">
                      {doc.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      {doc.readTime}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocCategories;
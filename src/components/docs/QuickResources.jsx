import React from 'react';
import { motion } from 'framer-motion';
import { Video, Code, FileText, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { resources } from '@/data/docsData';

const iconMap = {
  Video: Video,
  Code: Code,
  FileText: FileText,
  Download: Download,
};

const QuickResources = () => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Quick</span> Resources
          </h2>
          <p className="text-lg text-gray-300">
            Popular resources to get you started quickly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => {
            const IconComponent = iconMap[resource.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={handleDocClick}
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {IconComponent && <IconComponent className="h-6 w-6 text-blue-400" />}
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {resource.description}
                </p>
                <div className="text-xs text-blue-400 font-medium">
                  {resource.count}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickResources;
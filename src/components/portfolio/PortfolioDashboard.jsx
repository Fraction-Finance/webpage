import React from 'react';
import { motion } from 'framer-motion';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import QuickActions from '@/components/portfolio/QuickActions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const PortfolioDashboard = ({ portfolioData }) => {
  if (!portfolioData) {
    return (
      <div className="text-center p-8 glass-effect rounded-xl">
        <h3 className="text-xl font-semibold">Cargando datos del portafolio...</h3>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <PortfolioSummary summary={portfolioData} />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <PortfolioChart holdings={portfolioData.holdings} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PortfolioDashboard;
import React from 'react';
import { motion } from 'framer-motion';

interface CTASectionProps {
  isDark: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isDark }) => {
  return (
    <motion.section 
      className="px-4 py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
          Don't see the perfect role? We're always looking for talented individuals who share our passion for helping others succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-teal-600 hover:bg-teal-700'} text-white px-8 py-3 rounded-lg font-medium transition-colors`}
          >
            Apply Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-teal-400 text-teal-700 hover:bg-teal-50'} border px-8 py-3 rounded-lg font-medium transition-colors`}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
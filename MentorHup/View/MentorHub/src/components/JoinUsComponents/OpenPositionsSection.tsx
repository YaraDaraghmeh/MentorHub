import React from 'react';
import { motion } from 'framer-motion';
import PositionCard from './PositionCard';
import  type { Position } from '../../types/types';

interface OpenPositionsSectionProps {
  positions: Position[];
  isDark: boolean;
}

const OpenPositionsSection: React.FC<OpenPositionsSectionProps> = ({ positions, isDark }) => {
  return (
    <motion.section 
      className="px-4 py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Open Positions</h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover exciting opportunities to shape the future of career development and interview training
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {positions.map((position, index) => (
            <PositionCard
              key={position.id}
              position={position}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default OpenPositionsSection;
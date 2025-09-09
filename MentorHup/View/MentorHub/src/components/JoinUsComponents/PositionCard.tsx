import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, DollarSign } from 'lucide-react';
import  type { Position } from '../../types/types';

interface PositionCardProps {
  position: Position;
  index: number;
  isDark: boolean;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, index, isDark }) => {
  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const accentClass = isDark ? "text-cyan-400" : "text-teal-800";
  const iconColorClass = isDark ? "text-cyan-300" : "text-teal-700";

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`${cardClass} border rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xl font-semibold mb-2 group-hover:${accentClass} transition-colors`}>
            {position.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-teal-100 text-teal-800'}`}>
              {position.department}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${position.type === 'Full-time' 
              ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') 
              : (isDark ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-800')}`}>
              {position.type}
            </span>
          </div>
        </div>
        <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity ${iconColorClass}`} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{position.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{position.salary}</span>
        </div>
      </div>

      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}>
        {position.description}
      </p>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Key Requirements:</h4>
        <ul className="space-y-1">
          {position.requirements.map((req, reqIndex) => (
            <li key={reqIndex} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-start gap-2`}>
              <span className={`mt-1 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`}>•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PositionCard;
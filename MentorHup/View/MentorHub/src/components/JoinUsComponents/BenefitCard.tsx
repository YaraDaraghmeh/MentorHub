import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface BenefitCardProps {
  benefit: string;
  index: number;
  isDark: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, index, isDark }) => {
  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const iconColorClass = isDark ? "text-[#56e39f]" : "text-teal-700";
  const benefitIconBgClass = isDark ? "bg-[#374151] bg-opacity-40" : "bg-teal-300";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`${cardClass} border rounded-lg p-6 text-center hover:shadow-md transition-shadow`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${benefitIconBgClass} mb-4`}>
        <Star className={`w-6 h-6 ${iconColorClass}`} />
      </div>
      <p className="font-medium">{benefit}</p>
    </motion.div>
  );
};

export default BenefitCard;
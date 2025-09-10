import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  isDark: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isDark }) => {
  return (
    <>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${
          isDark 
            ? 'bg-gradient-to-b from-teal-950 to-teal-500' 
            : 'bg-gradient-to-b from-teal-800 to-[#96fbf1]'
        } relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <br/>
          <br/>
          <br/>
          <br/>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent !text-[#27b467]">
                Interview Mentor
              </span>
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Connect with experienced professionals from top companies and ace your next interview with personalized coaching
            </motion.p>
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <button className="bg-white text-[#27b467] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
        <br/>
          <br/>
          <br/>
          <br/><br/>
          <br/>
          
      </motion.section>


      {/* Stats Section */}
      
    </>
  );
};

export default HeroSection;

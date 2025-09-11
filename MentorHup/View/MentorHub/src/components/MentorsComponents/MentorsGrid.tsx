import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Users, Heart, Share2, Award } from 'lucide-react';
import  type { Mentor } from '../../types/types';
import { useTheme } from "../../Context/ThemeContext";

interface MentorsGridProps {
  mentors: Mentor[];
}

const MentorsGrid: React.FC<MentorsGridProps> = ({ mentors }) => {
  const { isDark } = useTheme();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "
        >
          {mentors.map((mentor) => (
            <motion.div
              key={mentor.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border transition-all duration-300 hover:shadow-xl relative ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:shadow-blue-500/10' 
                  : 'bg-white border-gray-200 hover:shadow-blue-500/20'
              }`}
            >
              
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${
                      mentor.isOnline ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {mentor.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}>
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}>
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Company and Location */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {mentor.company}
                  </span>
                  
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({mentor.reviews} reviews)
                    </span>
                  </div>
                  <div className={`flex items-center text-sm ${
                    mentor.isOnline 
                      ? 'text-green-500' 
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                   
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{mentor.experience}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{mentor.totalSessions}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">${mentor.hourlyRate}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Per Hour</div>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Success Rate
                    </span>
                    <span className="text-sm font-semibold text-green-600">{mentor.successRate}%</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mentor.successRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isDark 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {specialty}
                      </span>
                    ))}
                    {mentor.specialties.length > 2 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        +{mentor.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-teal-950 to-teal-500 hover:from-teal-500 hover:to-teal-950 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
                  >
                    Book Session
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-xl border font-medium transition-colors ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {mentors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No mentors found
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MentorsGrid;
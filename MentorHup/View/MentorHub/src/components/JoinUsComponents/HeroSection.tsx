import React from "react";
import { motion } from "framer-motion";
import { Users, Star, Briefcase } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const HeroSection: React.FC = () => {
  const { isDark } = useTheme();
  const accentClass = isDark ? "text-[#56e39f]" : "text-teal-800";
  const iconColorClass = isDark ? "text-[#56e39f]" : "text-teal-700";
  const iconBgClass = isDark ? "bg-cyan-900 bg-opacity-30" : "bg-teal-200";

  const features = [
    {
      icon: Users,
      title: "Growing Team",
      description: "Join our diverse team of passionate professionals",
    },
    {
      icon: Star,
      title: "Impact Driven",
      description: "Make a real difference in people's career journeys",
    },
    {
      icon: Briefcase,
      title: "Innovation",
      description: "Work with cutting-edge technology and methodologies",
    },
  ];

  return (
    <motion.section
      className="relative px-4 py-16 sm:py-24 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${accentClass}`}
          >
            Join Mentor Hub
          </h1>
          <p
            className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Help us revolutionize career development by connecting job seekers
            with experienced interview trainers worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${iconBgClass} mb-4`}
              >
                <feature.icon className={`w-8 h-8 ${iconColorClass}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;

import React from "react";
import { motion } from "framer-motion";
import { BiAnalyse } from "react-icons/bi";
import { HiLightBulb } from "react-icons/hi";
import { MdRecommend } from "react-icons/md";
import AnalyticsCard from "../HomePageComponents/insightsCards";
import { useTheme } from "../../Context/ThemeContext";

const AnalyticsDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      variants={backgroundVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`min-h-screen relative overflow-hidden ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--primary-green-light)]"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-green-500/10 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              isDark ? "text-white" : "text-[#06171c]"
            }`}
          >
            What the numbers say
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3 }}
            className={`text-lg md:text-xl ${
              isDark ? "text-gray-300" : "text-[#1b2a30]"
            }`}
          >
            Watch a real conversation unfold with interviews, evaluates
            responses, and gives insights in real-time
          </motion.p>
        </motion.div>

        {/* Displaying one by one */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnalyticsCard
            icon={<BiAnalyse size={24} />}
            title="Real-time Analysis"
            metrics={[
              { label: "Skill Match", value: 92, color: "#ff9500" },
              { label: "Analytical Thinking", value: 88, color: "#56e39f" },
              { label: "Communication", value: 85, color: "#00a7ff" },
              { label: "Leadership", value: 80, color: "#27b467" },
            ]}
            delay={0}
          />

          <AnalyticsCard
            icon={<HiLightBulb size={24} />}
            title="Key Insights"
            insights={[
              "Strong technical background with quantifiable results",
              "Demonstrates leadership in technical migrations",
              "Understanding of the basic programming concepts",
            ]}
            delay={0.2}
          />

          <AnalyticsCard
            icon={<MdRecommend size={24} />}
            title="Recommendation"
            recommendation={{
              matchPercentage: 89,
              text: "Candidate demonstrates excellent technical skills and communication. Recommend proceeding to technical round with focus on system design.",
            }}
            delay={0.4}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;

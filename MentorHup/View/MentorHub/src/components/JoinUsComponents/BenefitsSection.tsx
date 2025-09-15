import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import BenefitCard from "./BenefitCard";
import { useTheme } from "../../Context/ThemeContext";

interface BenefitsSectionProps {
  benefits: string[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  const { isDark } = useTheme();
  const sectionStyle = isDark
    ? { backgroundColor: "var(--primary-rgba)" }
    : { backgroundColor: "#96fbf1" };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      className="px-4 py-16"
      style={sectionStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Work With Us?
          </h2>
          <p
            className={`text-lg ${
              isDark ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            We believe in taking care of our team so they can do their best work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              custom={index} // 👈 required for dynamic delay
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <BenefitCard benefit={benefit} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;

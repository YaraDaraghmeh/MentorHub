import "../../index.css";
import { FaGoogle, FaMicrosoft } from "react-icons/fa6";
import { SiIntel, SiMeta } from "react-icons/si";
import { motion } from "framer-motion";
import { useTheme } from "../../Context/ThemeContext";

const CompanyLogosSection = () => {
  const { isDark } = useTheme();
  const companies = [
    {
      name: "Google",
      logo: <FaGoogle className="w-12 h-12 md:w-16 md:h-16" />,
    },
    { name: "Meta", logo: <SiMeta className="w-12 h-12 md:w-16 md:h-16" /> },
    {
      name: "Microsoft",
      logo: <FaMicrosoft className="w-12 h-12 md:w-16 md:h-16" />,
    },
    { name: "Intel", logo: <SiIntel className="w-12 h-12 md:w-16 md:h-16" /> },
  ];

  return (
    <div
      className={`pt-24 pb-16 transition-all duration-300 ${
        isDark
          ? "text-white bg-[#06171c]"
          : "text-[var(--primary)] bg-[#96FBF1]"
      }`}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2
            className={`text-base md:text-lg font-medium tracking-wide ${
              isDark ? "text-[var(--gray-light)]" : "text-[var(--primary)]"
            }`}
          >
            Experts from Leading technology Industries
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
              className={`group flex flex-col items-center justify-center p-4 md:p-6 
                          transition-all duration-300 transform hover:scale-110 ${
                            isDark
                              ? "rounded-xl hover:bg-[var(--primary-rgba)]"
                              : ""
                          }`}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className={`mb-3 transition-colors duration-300 ${
                  isDark
                    ? "text-[var(--gray-light)] group-hover:text-white"
                    : "text-[var(--primary)] group-hover:text-[var(--primary-dark)]"
                }`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {company.logo}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div
          className={`mt-8 flex justify-center space-x-4 ${
            isDark ? "opacity-30" : "opacity-40"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-[var(--secondary)]" : "bg-[var(--accent)]"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-[var(--secondary)]" : "bg-[var(--accent)]"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-[var(--secondary)]" : "bg-[var(--accent)]"
            }`}
          ></div>
        </div>

        <div className="text-center mt-6">
          <p
            className={`text-sm md:text-base ${
              isDark ? "text-[var(--gray-light)]" : "text-[var(--gray-medium)]"
            }`}
          >
            Trusted by industry leaders worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogosSection;

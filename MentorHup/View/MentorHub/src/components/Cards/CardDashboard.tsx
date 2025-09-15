import { motion } from "framer-motion";
import type React from "react";

interface StateCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isDark: boolean;
}

const CardDash = ({ title, value, icon, isDark }: StateCard) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`flex flex-col gap-2 items-center justify-between hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,25%)] rounded-2xl p-6 transition ${
          isDark
            ? "shadow-[0px_0px_12px_0px_rgba(0,0,0,25%)] text-[var(--secondary-light)] bg-[var(--primary-rgba)]"
            : "shadow-lg text-[var(--primary-light)] bg-[var(--secondary-light)]"
        }`}
      >
        <div
          className={`p-3 text-xl rounded-full ${
            isDark
              ? "text-[var(--green-dark)] bg-[var(--secondary)]"
              : "text-white bg-[var(--secondary)]"
          }`}
        >
          {icon}
        </div>
        <h1 className="text-xl font-semibold">{value}</h1>
        <span className="text-medium font-meduim">{title}</span>
      </div>
    </motion.div>
  );
};

export default CardDash;

import type React from "react";

interface StateCard {
  title: string;
  value: string | number;
  bgColor?: string;
  icon: React.ReactNode;
  isDark: boolean;
}

const CardDash = ({ title, value, bgColor, icon, isDark }: StateCard) => {
  return (
    <div
      className={`flex items-center justify-between bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition border-t-4 ${bgColor}`}
    >
      <div
        className={`p-2 text-xl ${isDark ? "bg-" : "bg-[var(--secondary)]"}`}
      >
        {icon}
      </div>
      <h2 className="font-semibold">{value}</h2>
      <span className="font-base">{title}</span>
    </div>
  );
};

export default CardDash;

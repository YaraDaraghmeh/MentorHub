import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../Context/ThemeContext";
import React from "react";

type chartItem = {
  label: string;
  value: number;
};

interface ApxChartProps {
  data: chartItem[];
}

const ApxChartDash: React.FC<ApxChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  const series = data.map((d) => d.value);
  const labels = data.map((d) => d.label);

  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    colors: isDark
      ? ["var(--secondary)", "var(--cyan-800)"]
      : ["var(--secondary-dark)", "var(--teal-950)"],
    legend: {
      position: "right",
      labels: {
        colors: isDark ? "var(--secondary-light)" : "var(--primary)",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
      style: {
        colors: [isDark ? "var(--primary)" : "var(--secondary-light)"],
      },
    },
  };

  const totalUsers = series.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center">
      <h2
        className={`text-xl font-bold mb-2 ${
          isDark ? "text-[var(--secondary-light)]" : "text-[var(--primary)]"
        }`}
      >
        Users Distribution
      </h2>
      <p
        className={`mb-4 ${
          isDark ? "text-[var(--secondary)]" : "text-[var(--green-dark)]"
        }`}
      >
        Total Users: {totalUsers}
      </p>

      <ReactApexChart
        className="transition"
        options={options}
        series={series}
        type="donut"
        width={380}
      />
    </div>
  );
};

export default ApxChartDash;

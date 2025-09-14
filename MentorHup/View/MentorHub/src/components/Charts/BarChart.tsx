import Chart from "react-apexcharts";
import { useTheme } from "../../Context/ThemeContext";
import type React from "react";

type chartItem = {
  label: string;
  value: number;
};

interface BarChartProps {
  data: chartItem[];
}

const BarChartDash: React.FC<BarChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  const options = {
    chart: { id: "revenue-chart", toolbar: { show: false } },
    xaxis: {
      categories: data.map((item) => item.label),
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: data.map(() =>
            isDark ? "var(--secondary-light)" : "var(--primary-dark)"
          ),
          fontSize: "14px",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {
        show: true,
        showDuplicates: false,
        align: "right" as const,
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: [isDark ? "var(--secondary-light)" : "var(--primary-dark)"],
          fontSize: "14px",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
      },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    colors: [isDark ? "#56e39f" : "#1e874e"],
    markers: { size: 5 },
    tooltip: { enabled: true },
    grid: { show: false },
  };

  const series = [{ name: "Value", data: data.map((item) => item.value) }];

  return (
    <Chart
      className="transition"
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
};

export default BarChartDash;
import Chart from "react-apexcharts";
import { useTheme } from "../../Context/ThemeContext";
import type React from "react";
import FormateWeekly from "../Dashboard/formateWeekly";

type chartItem = {
  weekLabel: string;
  count: number;
};

type earnItem = {
  weekLabel: string;
  totalEarnings: number;
};

type BarChartData = chartItem | earnItem;

interface BarChartProps {
  data: BarChartData[];
}

const BarChartDash: React.FC<BarChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  const seriesName = data.some((item) => "totalEarnings" in item)
    ? "Earnings"
    : "Value";

  const seriesData = data.map((item) =>
    "count" in item
      ? item.count
      : "totalEarnings" in item
      ? item.totalEarnings
      : 0
  );

  const options = {
    chart: { id: "revenue-chart", toolbar: { show: false } },
    xaxis: {
      categories: data.map((item) => FormateWeekly(item.weekLabel ?? "")),
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        maxHeight: 120,
        style: {
          colors: data.map(() =>
            isDark ? "var(--secondary-light)" : "var(--primary-dark)"
          ),
          fontSize: "14px",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: "right" as const,
        maxWidth: 160,
        style: {
          colors: [isDark ? "var(--secondary-light)" : "var(--primary-dark)"],
          fontSize: "14px",
          fontWeight: 400,
        },
      },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    colors: [isDark ? "#56e39f" : "#1e874e"],
    markers: { size: 5 },
    tooltip: { enabled: true },
    grid: { show: false },
  };

  return (
    <Chart
      className="transition"
      options={options}
      series={[{ name: seriesName, data: seriesData }]}
      type="area"
      height={350}
    />
  );
};

export default BarChartDash;

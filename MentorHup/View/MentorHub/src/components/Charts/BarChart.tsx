import Chart from "react-apexcharts";
import { useTheme } from "../../Context/ThemeContext";

const BarChartDash = () => {
  const { isDark } = useTheme();

  const sessions = [
    { week: "Week 1", sessions: 3 },
    { week: "Week 2", sessions: 7 },
    { week: "Week 3", sessions: 6 },
    { week: "Week 4", sessions: 8 },
    { week: "Week 5", sessions: 5 },
    { week: "Week 5", sessions: 3 },
  ];

  const options = {
    chart: { id: "revenue-chart", toolbar: { show: false } },
    xaxis: {
      categories: sessions.map((s) => s.week),
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
          colors: sessions.map((s) =>
            isDark ? "var(--secondary-light" : "var(--primary-dark)"
          ),
          fontSize: "14px",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {
        show: true,
        showDuplicates: false,
        align: "right",
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: [isDark ? "var(--secondary-light" : "var(--primary-dark)"],
          fontSize: "14px",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
      },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: [isDark ? "#56e39f" : "#1e874e"], // 475467
    markers: { size: 5 },
    tooltip: { enabled: true },
    grid: { show: false },
  };

  const series = [{ name: "Sessions", data: sessions.map((s) => s.sessions) }];

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default BarChartDash;

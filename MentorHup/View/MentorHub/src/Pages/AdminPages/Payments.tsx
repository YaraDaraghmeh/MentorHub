import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoStatsChartSharp } from "react-icons/io5";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import urlAdmin from "../../Utilities/Admin/urlAdmin";
import BarChartDash from "../../components/Charts/BarChart";
import urlDashboard from "../../Utilities/Dashboard/urlDashboard";
import type { earn } from "../../components/Tables/interfaces";

const Payments = () => {
  const { isDark } = useTheme();
  const [statistics, setStatistics] = useState({
    averagePayment: 0,
    totalPayments: 0,
  });
  const [earningPerWeek, setEarningPerWeek] = useState<earn[]>([]);

  const state = [
    {
      title: "Total Payments",
      value: `$${statistics.totalPayments}`,
      icon: <FaMoneyCheckDollar />,
      color: "",
    },
    {
      title: "Average Payment",
      value: `$${statistics.averagePayment}`,
      icon: <IoStatsChartSharp />,
      color: "",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("Not Authorized");
      return;
    }

    console.log(token);

    const getDataUsers = async () => {
      try {
        const numbers = await axios.get(urlAdmin.GET_STATISTICS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistics(numbers.data);
      } catch (error: any) {
        console.error("Error fetching statistics:", error);
      }
    };

    getDataUsers();

    const getEarning = async () => {
      try {
        const res = await axios.get(urlDashboard.EARNING_PER_WEEK, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEarningPerWeek(res.data);
        console.log(res.data);
      } catch (err: any) {
        console.log("get earning per week error", err);
      }
    };

    getEarning();
  }, []);

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 py-6">
        {state.map((state, index) => (
          <CardDash
            key={index}
            title={state.title}
            icon={state.icon}
            value={state.value}
            isDark={isDark}
          />
        ))}
        <div className="col-span-3">
          <BarChartDash data={earningPerWeek} />
        </div>
      </div>
    </>
  );
};

export default Payments;

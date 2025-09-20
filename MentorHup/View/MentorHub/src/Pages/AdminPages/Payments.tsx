import PaymentsInSystem from "../../components/Tables/tablePaymets";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoStatsChartSharp } from "react-icons/io5";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import urlAdmin from "../../Utilities/Admin/urlAdmin";

const Payments = () => {
  const { isDark } = useTheme();
  const [statistics, setStatistics] = useState({
    averagePayment: 0,
    pendingPayments: 0,
    totalPayments: 0,
  });

  const state = [
    {
      title: "Total Payments",
      value: statistics.totalPayments,
      icon: <FaMoneyCheckDollar />,
      color: "",
    },
    {
      title: "Payment Cancelled",
      value: statistics.pendingPayments,
      icon: <MdCancel />,
      color: "",
    },
    {
      title: "Average Payment",
      value: statistics.averagePayment,
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
  }, []);

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {state.map((state, index) => (
          <CardDash
            key={index}
            title={state.title}
            icon={state.icon}
            value={state.value}
            isDark={isDark}
          />
        ))}
      </div>

      <PaymentsInSystem />
    </>
  );
};

export default Payments;

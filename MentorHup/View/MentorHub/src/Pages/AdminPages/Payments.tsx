import PaymentsInSystem from "../../components/Tables/tablePaymets";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoStatsChartSharp } from "react-icons/io5";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";
import { MdCancel } from "react-icons/md";

const Payments = () => {
  const { isDark } = useTheme();

  const state = [
    {
      title: "Total Payments",
      value: "120",
      icon: <FaMoneyCheckDollar />,
      color: "",
    },
    {
      title: "Payment Cancelled",
      value: "22",
      icon: <MdCancel />,
      color: "",
    },
    {
      title: "Average Payment",
      value: "30",
      icon: <IoStatsChartSharp />,
      color: "",
    },
  ];

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

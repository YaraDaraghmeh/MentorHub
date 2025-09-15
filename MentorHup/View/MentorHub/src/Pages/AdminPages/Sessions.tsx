import {
  BsCalendar2CheckFill,
  BsCalendarXFill,
  BsFillCalendar3WeekFill,
} from "react-icons/bs";
import TableBooking from "../../components/Tables/tableBooking";
import { FaRegCalendarDays } from "react-icons/fa6";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";

const SessionsAdm = () => {
  const { isDark } = useTheme();

  const state = [
    {
      title: "Total Sessions",
      value: "12",
      icon: <FaRegCalendarDays />,
      color: "",
    },
    {
      title: "Sessions Completed",
      value: "33",
      icon: <BsCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Sessions Cancelled",
      value: "4",
      icon: <BsCalendarXFill />,
      color: "",
    },
    {
      title: "Sessions Pending",
      value: "60",
      icon: <BsFillCalendar3WeekFill />,
      color: "",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {state.map((state, index) => (
          <CardDash
            key={index}
            title={state.title}
            icon={state.icon}
            value={state.value}
            // bgColor={state.color}
            isDark={isDark}
          />
        ))}
      </div>

      <TableBooking />
    </>
  );
};

export default SessionsAdm;

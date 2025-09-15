import {
  BsFillCalendar2CheckFill,
  BsFillPeopleFill,
  BsStarHalf,
} from "react-icons/bs";
import { useTheme } from "../../Context/ThemeContext";
import CardDash from "../Cards/CardDashboard";
import { FaUserTie } from "react-icons/fa";
import ApxChartDash from "../Charts/ApexChart";
import BarChartDash from "../Charts/BarChart";
import TableBooking from "../Tables/tableBooking";
import TableReview from "../Tables/tableReview";

const DashboardAdmin = () => {
  const { isDark } = useTheme();

  const state = [
    {
      title: "Total Users",
      value: "120",
      icon: <BsFillPeopleFill />,
      color: "",
    },
    {
      title: "Total Reviews",
      value: "22",
      icon: <BsStarHalf />,
      color: "",
    },
    {
      title: "Interviews Booked",
      value: "30",
      icon: <BsFillCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Revenues",
      value: "$250",
      icon: <FaUserTie />,
      color: "",
    },
  ];

  const sessions = [
    { label: "Week 1", value: 3 },
    { label: "Week 2", value: 7 },
    { label: "Week 3", value: 6 },
    { label: "Week 4", value: 8 },
    { label: "Week 5", value: 5 },
    { label: "Week 6", value: 3 },
  ];

  const users = [
    { label: "Mentors", value: 23 },
    { label: "Mentees", value: 44 },
  ];

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
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

      {/*Charts  */}
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <div className="col-span-2">
          <BarChartDash data={sessions} />
        </div>
        <div className="col-span-1">
          <ApxChartDash data={users} />
        </div>
      </div>

      {/* Table Booking */}
      <div className="py-7 w-full">
        <TableBooking />
      </div>

      {/* Table Review */}
      <TableReview />
    </>
  );
};

export default DashboardAdmin;

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
import TableReview from "../Tables/tableReview";
import { useEffect, useState } from "react";
import axios from "axios";
import urlAdmin from "../../Utilities/Admin/urlAdmin";
import type { week } from "../Tables/interfaces";
import { GetBookingPerWeek } from "../../hooks/getWeeks";
import TableAdminBooking from "../Tables/tableAdmin";

const DashboardAdmin = () => {
  const { isDark } = useTheme();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalReviews: 0,
    totalBookings: 0,
    totalMentors: 0,
    totalMentees: 0,
    myWallet: 0,
  });

  const [sessions, setSessions] = useState<week[]>([]);

  const users = [
    { label: "Mentors", value: statistics.totalMentors },
    { label: "Mentees", value: statistics.totalMentees },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("Not Authorized");
      return;
    }

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

    const countBookingPerWeek = async () => {
      const booking = await GetBookingPerWeek();
      setSessions(booking);
    };

    countBookingPerWeek();
  }, []);

  const state = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      icon: <BsFillPeopleFill />,
      color: "",
    },
    {
      title: "Total Reviews",
      value: statistics.totalReviews,
      icon: <BsStarHalf />,
      color: "",
    },
    {
      title: "Interviews Booked",
      value: statistics.totalBookings,
      icon: <BsFillCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Revenues",
      value: "$" + statistics.myWallet,
      icon: <FaUserTie />,
      color: "",
    },
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
        <TableAdminBooking />
      </div>

      {/* Table Review */}
      <TableReview />
    </>
  );
};

export default DashboardAdmin;

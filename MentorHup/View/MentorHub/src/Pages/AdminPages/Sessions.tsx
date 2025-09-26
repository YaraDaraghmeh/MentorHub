import { BsCalendar2CheckFill, BsCalendarXFill } from "react-icons/bs";
import { FaRegCalendarDays } from "react-icons/fa6";
import CardDash from "../../components/Cards/CardDashboard";
import { IoPeopleSharp } from "react-icons/io5";
import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import urlAdmin from "../../Utilities/Admin/urlAdmin";
import TableAdminBooking from "../../components/Tables/tableAdmin";

const SessionsAdm = () => {
  const { isDark } = useTheme();
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    mentorsWithNoBookings: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("Not Authorized");
    }

    const getData = async () => {
      try {
        const res = await axios.get(urlAdmin.GET_STATISTICS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistics(res.data);
        console.log(res.data);
      } catch (error: any) {}
    };

    getData();
  }, []);

  const state = [
    {
      title: "Total Sessions",
      value: statistics.totalBookings,
      icon: <FaRegCalendarDays />,
      color: "",
    },
    {
      title: "Sessions Completed",
      value: statistics.confirmedBookings,
      icon: <BsCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Sessions Cancelled",
      value: statistics.cancelledBookings,
      icon: <BsCalendarXFill />,
      color: "",
    },
    {
      title: "Mentors without Booking",
      value: statistics.mentorsWithNoBookings,
      icon: <IoPeopleSharp />,
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

      <TableAdminBooking />
    </>
  );
};

export default SessionsAdm;

import { MdOutlineAttachMoney } from "react-icons/md";
import {
  BsFillCalendar2CheckFill,
  BsStarHalf,
  BsFillPeopleFill,
} from "react-icons/bs";
import CardDash from "../Cards/CardDashboard";
import CardLabel from "../Cards/CardLabel";
import picture from "../../assets/avatar-profile.png";
import { useTheme } from "../../Context/ThemeContext";
import BarChartDash from "../Charts/BarChart";
import { useEffect, useState } from "react";
import axios from "axios";
import urlMentor from "../../Utilities/Mentor/urlMentor";
import type { BookingData, week } from "../Tables/interfaces";
import { GetBookingPerWeek } from "../../hooks/getWeeks";
import { GetBooking } from "../../hooks/getBooking";
import FormateDate from "../Tables/date";
import FormatTime from "../Chatting/FormateTime";
import { useNavigate } from "react-router-dom";

const DashboardMentor = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMentees: 0,
    totalReviews: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
  });
  const [sessions, setSessions] = useState<week[]>([]);
  const [booking, setBooking] = useState<BookingData[]>([]);

  useEffect(() => {
    const fetchMentorDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken")?.trim();
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;
        const res = await axios.get(urlMentor.MENTOR_DASHBOARD as string, {
          headers,
        });
        const data = res.data || {};
        setStats({
          totalMentees: Number(data.totalMentees) || 0,
          totalReviews: Number(data.totalReviews) || 0,
          totalEarnings: Number(data.totalEarnings) || 0,
          upcomingBookings: Number(data.upcomingBookings) || 0,
        });
      } catch (err: any) {
        console.error(
          "Failed to load mentor dashboard stats",
          err?.response?.status,
          err?.response?.data || err?.message
        );
      }
    };
    fetchMentorDashboard();

    const countBookingPerWeek = async () => {
      const booking = await GetBookingPerWeek();
      setSessions(booking);
    };
    countBookingPerWeek();

    const getBooking = async () => {
      const data = await GetBooking();
      setBooking(data);
    };

    getBooking();
  }, []);

  const state = [
    {
      title: "Mentees",
      value: stats.totalMentees,
      icon: <BsFillPeopleFill />,
      color: "",
    },
    {
      title: "Reviews",
      value: stats.totalReviews,
      icon: <BsStarHalf />,
      color: "",
    },
    {
      title: "Upcoming Sessions",
      value: stats.upcomingBookings,
      icon: <BsFillCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Earnings",
      value: `$${stats.totalEarnings}`,
      icon: <MdOutlineAttachMoney />,
      color: "",
    },
  ];

  const handleOpen = () => {
    navigate("/mentor/booking");
  };

  return (
    <>
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

      {/*  & Upcoming Secssion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <div className="col-span-2">
          <BarChartDash data={sessions} />
        </div>
        <div className="col-span-1">
          <div className="py-2 flex">
            <h2
              className={`justify-start text-base font-bold leading-normal ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)]"
              }`}
            >
              Interview Schedule
            </h2>
          </div>
          <>
            {booking.length > 0 ? (
              booking.slice(0, 3).map((item, index) => (
                <span onClick={handleOpen}>
                  <CardLabel
                    key={index}
                    name={item.menteeName}
                    date={FormateDate(item.startTime)}
                    picture={item.menteeImageLink || picture}
                    time={FormatTime(item.startTime)}
                    isDark={isDark}
                  />
                </span>
              ))
            ) : (
              <span
                className={`flex flex-col h-60 justify-center items-center ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary)]"
                }`}
              >
                No Booking
              </span>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default DashboardMentor;

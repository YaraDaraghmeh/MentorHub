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
import urlDashboard from "../../Utilities/Dashboard/urlDashboard";
import type { week } from "../Tables/interfaces";
import { GetBookingPerWeek } from "../../hooks/getWeeks";

const DashboardMentor = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalMentees: 0,
    totalReviews: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
  });
  const [sessions, setSessions] = useState<week[]>([]);

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
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardMentor;

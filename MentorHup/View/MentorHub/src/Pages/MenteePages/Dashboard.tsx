import { BsFillCalendar2CheckFill } from "react-icons/bs";
import { useTheme } from "../../Context/ThemeContext";
import CardDash from "../../components/Cards/CardDashboard";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FaUserTie, FaClock } from "react-icons/fa";
import BarChartDash from "../../components/Charts/BarChart";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useEffect, useState } from "react";
import { GetBookingPerWeek } from "../../hooks/getWeeks";
import type { week } from "../../components/Tables/interfaces";
import MentorTableBooking from "../../components/Tables/tableBooking";

const DashboardMentee = () => {
  const { isDark } = useTheme();
  const [sessions, setSessions] = useState<week[]>([]);
  const { stats, loading, error, refetch } = useDashboardStats();

  useEffect(() => {
    const countBookingPerWeek = async () => {
      const booking = await GetBookingPerWeek();
      setSessions(booking);
    };
    countBookingPerWeek();
  });

  // Create dashboard cards with real data or loading state
  const getDashboardCards = () => {
    if (loading) {
      return [
        {
          title: "My Mentors",
          value: "...",
          icon: <FaUserTie />,
          color: "",
        },
        {
          title: "Scheduled Sessions",
          value: "...",
          icon: <BsFillCalendar2CheckFill />,
          color: "",
        },
        {
          title: "Completed Sessions",
          value: "...",
          icon: <MdOutlineCheckCircle />,
          color: "",
        },
        {
          title: "Learning Hours",
          value: "...",
          icon: <FaClock />,
          color: "",
        },
      ];
    }

    return [
      {
        title: "My Mentors",
        value: stats?.myMentors.toString() || "0",
        icon: <FaUserTie />,
        color: "",
      },
      {
        title: "Scheduled Sessions",
        value: stats?.scheduledSessions.toString() || "0",
        icon: <BsFillCalendar2CheckFill />,
        color: "",
      },
      {
        title: "Completed Sessions",
        value: stats?.completedSessions.toString() || "0",
        icon: <MdOutlineCheckCircle />,
        color: "",
      },
      {
        title: "Learning Hours",
        value: stats?.learningHours.toString() || "0",
        icon: <FaClock />,
        color: "",
      },
    ];
  };

  const dashboardCards = getDashboardCards();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span>Failed to load dashboard statistics: {error}</span>
              <button
                onClick={refetch}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {dashboardCards.map((card, index) => (
          <CardDash
            key={index}
            title={card.title}
            icon={card.icon}
            value={card.value}
            isDark={isDark}
          />
        ))}
      </div>

      {/*Charts  */}
      <div className="py-6">
        <div className="flex justify-center">
          <div className="w-full">
            <BarChartDash data={sessions} />
          </div>
        </div>
      </div>

      {/* Table Sessions */}
      <div className="py-7 w-full">
        <MentorTableBooking />
      </div>
    </>
  );
};

export default DashboardMentee;

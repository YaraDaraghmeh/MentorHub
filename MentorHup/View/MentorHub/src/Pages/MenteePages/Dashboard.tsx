import { BsFillCalendar2CheckFill, BsFillBookmarkFill } from "react-icons/bs";
import { useTheme } from "../../Context/ThemeContext";
import CardDash from "../../components/Cards/CardDashboard";
import { MdOutlineSchedule, MdOutlineCheckCircle } from "react-icons/md";
import { FaUserTie, FaClock } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import BarChartDash from "../../components/Charts/BarChart";
import Table from "../../components/Tables/Table";
import data from "../../components/Tables/dataTable.json";
import Eye from "../../components/Tables/eyeicon";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "../../hooks/useDashboardStats";

const DashboardMentee = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { stats, loading, error, refetch } = useDashboardStats();

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

  const learningProgress = [
    { label: "Week 1", value: 2 },
    { label: "Week 2", value: 4 },
    { label: "Week 3", value: 3 },
    { label: "Week 4", value: 5 },
    { label: "Week 5", value: 4 },
    { label: "Week 6", value: 6 },
  ];

  const columns = [
    {
      header: "Mentor Name",
      accessor: "name" as const,
      render: (row: any) => {
        return (
          <div className="flex items-center gap-3 justify-start text-start">
            <div className="w-12 h-12">
              <img
                src={row.image}
                className="w-full h-full rounded-full"
                alt="profile"
              />
            </div>
            {row.name}
          </div>
        );
      },
    },
    { header: "Date & time", accessor: "date" as const },
    { header: "Duration", accessor: "duration" as const },
    { header: "Session Type", accessor: "status" as const }, // Using existing status field since 'type' doesn't exist
    {
      header: "Status",
      accessor: "status" as const,
      render: (row: any) => (
        <span
          className={`font-semibold p-2 rounded-full text-white ${
            row.status === "Confirmed"
              ? "bg-[var(--secondary-dark)]"
              : row.status === "Completed"
              ? "bg-green-500"
              : "bg-[var(--red-light)]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "id" as const,
      render: () => (
        <div className="flex justify-center items-center">
          <Eye className="w-5 h-5 cursor-pointer" />
        </div>
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Track your progress and manage your mentoring sessions
        </p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
      
      </div>

      {/*Charts  */}
      <div className="py-6">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <BarChartDash data={learningProgress} />
          </div>
        </div>
      </div>

      {/* Table Sessions */}
      <div className="py-7 w-full">
        <Table titleTable="My Booked Sessions" data={data} columns={columns} />
      </div>
    </>
  );
};

export default DashboardMentee;
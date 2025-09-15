import { BsFillCalendar2CheckFill, BsFillBookmarkFill } from "react-icons/bs";
import { useTheme } from "../../Context/ThemeContext";
import CardDash from "../Cards/CardDashboard";
import { MdOutlineSchedule, MdOutlineCheckCircle } from "react-icons/md";
import { FaUserTie, FaClock } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import ApxChartDash from "../Charts/ApexChart";
import BarChartDash from "../Charts/BarChart";
import Table from "../Tables/Table";
import data from "../Tables/dataTable.json";
import Eye from "../Tables/eyeicon";

const DashboardMentee = () => {
  const { isDark } = useTheme();

  const state = [
    {
      title: "My Mentors",
      value: "3",
      icon: <FaUserTie />,
      color: "",
    },
    {
      title: "Scheduled Sessions",
      value: "8",
      icon: <BsFillCalendar2CheckFill />,
      color: "",
    },
    {
      title: "Completed Sessions",
      value: "15",
      icon: <MdOutlineCheckCircle />,
      color: "",
    },
    {
      title: "Learning Hours",
      value: "42",
      icon: <FaClock />,
      color: "",
    },
  ];

  // Progress over weeks - mentee's learning journey
  const learningProgress = [
    { label: "Week 1", value: 2 },
    { label: "Week 2", value: 4 },
    { label: "Week 3", value: 3 },
    { label: "Week 4", value: 5 },
    { label: "Week 5", value: 4 },
    { label: "Week 6", value: 6 },
  ];

  // Session types distribution
  const sessionTypes = [
    { label: "Technical Skills", value: 35 },
    { label: "Career Guidance", value: 25 },
    { label: "Project Review", value: 20 },
    { label: "Interview Prep", value: 20 },
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
      render: (row: any) => {
        const status = row.status?.trim().toLowerCase();

        const statusColors: Record<string, string> = {
          confirmed: "bg-[var(--secondary-dark)]",
          cancelled: "bg-[var(--red-light)]",
          pending: "bg-[#ffc300]",
        };

        const bgColor = statusColors[status] || "bg-gray-200";

        return (
          <span
            className={`font-semibold p-2 rounded-full text-white ${bgColor}`}
          >
            {row.status}
          </span>
        );
      },
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

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome back to your learning journey! 🚀
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Track your progress and manage your mentoring sessions
        </p>
      </div>

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors">
          <MdOutlineSchedule className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Book Session</span>
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors">
          <BiTask className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">View Goals</span>
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors">
          <BsFillBookmarkFill className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Resources</span>
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors">
          <FaClock className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Schedule</span>
        </button>
      </div>

      {/*Charts  */}
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <div className="col-span-2">
          <BarChartDash data={learningProgress} />
        </div>
        <div className="col-span-1">
          <ApxChartDash data={sessionTypes} />
        </div>
      </div>

      {/* Table Booking */}
      <div className="py-7 w-full">
        <Table titleTable="My Sessions" data={data} columns={columns} />
      </div>
    </>
  );
};

export default DashboardMentee;

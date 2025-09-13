import { BsFillCalendar2CheckFill, BsFillPeopleFill } from "react-icons/bs";
import { useTheme } from "../../Context/ThemeContext";
import CardDash from "../Cards/CardDashboard";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import ApxChartDash from "../Charts/ApexChart";
import BarChartDash from "../Charts/BarChart";
import Table from "../Tables/Table";
import data from "../Tables/dataTable.json";
import Eye from "../Tables/eyeicon";

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
      title: "Total Mentors",
      value: "80",
      icon: <MdOutlineAttachMoney />,
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
    { label: "Week 5", value: 3 },
  ];

  const users = [
    { label: "Mentors", value: 23 },
    { label: "Mentees", value: 44 },
  ];

  const colums = [
    {
      header: "Name Mentee",
      accessor: "name",
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
    { header: "Date & time", accessor: "date" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Status",
      accessor: "status",
      render: (row: any) => (
        <span
          className={`font-sembold p-2 rounded-full text-white ${
            row.status === "Confirmed"
              ? "bg-[var(--secondary-dark)]"
              : "bg-[var(--red-light)]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      render: () => (
        <div className="flex justify-center items-center">
          <Eye className="w-5 h-5 cursor-pointer" />
        </div>
      ),
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
        <Table titleTable="Booking" data={data} columns={colums} />
      </div>
    </>
  );
};

export default DashboardAdmin;

import { BsFillPeopleFill } from "react-icons/bs";
import TableUser from "../../components/Tables/tableUsers";
import { FaUserTie } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";

const Users = () => {
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
      value: "22",
      icon: <FaChalkboardTeacher />,
      color: "",
    },
    {
      title: "Total Mentee",
      value: "30",
      icon: <FaUserTie />,
      color: "",
    },
    {
      title: "Active Users",
      value: "250",
      icon: <FaUsers />,
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

      <TableUser />
    </>
  );
};

export default Users;

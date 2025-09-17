import { BsFillPeopleFill } from "react-icons/bs";
import TableUser from "../../components/Tables/tableUsers";
import { FaUserTie } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import CardDash from "../../components/Cards/CardDashboard";
import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import urlAdmin from "../../Utilities/Admin/urlAdmin";
import axios from "axios";

const Users = () => {
  const { isDark } = useTheme();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    activeUsers: 0,
  });

  const state = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      icon: <BsFillPeopleFill />,
      color: "",
    },
    {
      title: "Total Mentors",
      value: statistics.totalMentors,
      icon: <FaChalkboardTeacher />,
      color: "",
    },
    {
      title: "Total Mentee",
      value: statistics.totalMentees,
      icon: <FaUserTie />,
      color: "",
    },
    {
      title: "Active Users",
      value: statistics.activeUsers,
      icon: <FaUsers />,
      color: "",
    },
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
  }, []);

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

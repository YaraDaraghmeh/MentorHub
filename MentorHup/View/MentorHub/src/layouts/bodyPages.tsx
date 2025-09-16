import { useState } from "react";
import SideBar from "../components/SideBar/SideBarDashboard";
import { BiSearch } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { useTheme } from "../Context/ThemeContext";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

type UserRole = "Admin" | "Mentor" | "Mentee";

const BodySystem = () => {
  const { isDark, toggle } = useTheme();
  const { roles, email, userId } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`flex min-h-screen gap-5 w-full ${
        isDark ? "bg-[var(--primary-light)]" : "bg-white"
      }`}
    >
      <SideBar
        profile={{ email, userId, name: null }}
        role={roles as UserRole}
        expended={isSidebarOpen}
        setExpended={setIsSidebarOpen}
      />

      {/* page */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen && window.innerWidth > 768 ? "ml-[230px]" : "ml-20"
        }`}
      >
        <div className="flex flex-col p-5 gap-7">
          {/* header */}
          <div className="w-full flex flex-col lg:gap-0 lg:flex-row gap-3 justify-between items-center">
            <div className="flex justify-center items-center gap-2.5">
              <div
                className={`justify-start text-lg font-bold leading-7 ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary)]"
                }`}
              >
                <span>Hello</span>
                <span
                  className={` ${
                    isDark
                      ? "text-[var(--secondary)]"
                      : "text-[var(--secondary-dark)]"
                  }`}
                >
                  {email}
                </span>
                <span>, Welcome Back!</span>
              </div>
            </div>

            {/* Search */}
            <div
              className={`flex-1 w-full lg:max-w-[660px] h-9 p-3.5 rounded-[52px] outline outline-2 outline-offset-[-2px] flex justify-between items-center overflow-hidden ${
                isDark
                  ? "outline-[var(--primary)] text-[var(--aqua-green)] bg-[var(--primary-rgba)]"
                  : "outline-[var(--System-Gray-200)] text-[var(--System-Gray-400)] bg-white"
              }`}
            >
              <input
                className="justify-start text-base font-medium  leading-normal"
                placeholder="Search..."
              />
              <div className="w-5 h-5">
                <BiSearch className="w-full h-full" />
              </div>
            </div>

            {/* Icons Container */}
            <div className="flex items-center gap-2 justify-center sm:justify-end flex-shrink-0">
              {/* Notifications */}
              <button
                className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors duration-200 ${
                  isDark
                    ? "text-white hover:bg-white"
                    : "text-[var(--primary)] hover:bg-[var(--primary)]"
                }`}
                aria-label="Notifications"
              >
                <IoNotifications className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "hover:bg-gray-700 text-yellow-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <BsSunFill className="w-5 h-5 lg:w-6 lg:h-6" />
                ) : (
                  <BsMoonFill className="w-5 h-5 lg:w-6 lg:h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 py-5">
            <Outlet />
          </div>
        </div>

        <div className="fixed right-0 top-1/5 group">
          <button
            type="button"
            className={`transition text-white py-2 px-4 rounded-l-full text-lg ${
              isDark ? "bg-[var(--secondary-dark)]" : "bg-[var(--green-dark)]"
            }`}
          >
            <FaTools size={24} />
            <span className="absolute right-12 top-1/1 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Manage Skills
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodySystem;

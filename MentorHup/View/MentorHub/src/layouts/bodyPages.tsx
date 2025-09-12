import { useState } from "react";
import SideBar from "../components/SideBar/SideBarDashboard";
import { BiSearch } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { useTheme } from "../Context/ThemeContext";

const userProfile = {
  name: " Sara Sayed Ahmad",
  email: "sara@example.com",
};

const BodySystem = () => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`flex min-h-screen gap-5 w-full ${
        isDark ? "bg-[var(--primary-light)]" : "bg-white"
      }`}
    >
      <SideBar
        profile={userProfile}
        role="mentee"
        expended={isSidebarOpen}
        setExpended={setIsSidebarOpen}
      />

      {/* page */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[230px]" : "ml-20"
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
                  {userProfile.name}
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

            <div className="flex">
              <IoNotifications
                className={`lg:w-[24px] lg:h-[24px] md:w-[22px] md:h-[22px] ${
                  isDark ? "text-white" : "text-[var(--primary-rgba)]"
                }`}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 py-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodySystem;

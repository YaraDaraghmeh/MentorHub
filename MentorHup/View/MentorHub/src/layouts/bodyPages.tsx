import { useState, useEffect } from "react";
import SideBar from "../components/SideBar/SideBarDashboard";
import { BiSearch } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import ModalSkills from "../components/Modal/ModalSkills";
import TableSkills from "../components/Tables/tableSkills";
import { FaFacebookMessenger } from "react-icons/fa";
import NotificationMessages from "../components/Notifications/NotificationMessage";

type UserRole = "Admin" | "Mentor" | "Mentee";

const BodySystem = () => {
  const { isDark, toggle } = useTheme();
  const { roles, email, userId, isAuthenticated, userName } = useAuth(); // أضفت isAuthenticated
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    console.log("BodySystem - Auth data updated:", {
      isAuthenticated,
      roles,
      email,
      userId,
      userName,
    });
  }, [isAuthenticated, roles, email, userId, userName]);

  // إذا مش مسجل دخول، ما تعرض الـ component
  if (!isAuthenticated) {
    console.log("BodySystem - User not authenticated");
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex min-h-screen gap-5 w-full ${
        isDark ? "bg-[var(--primary-light)]" : "bg-white"
      }`}
    >
      <SideBar
        profile={{
          email,
          userId,
          userName: userName,
        }}
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
                <span>Hello </span>
                <span
                  className={` ${
                    isDark
                      ? "text-[var(--secondary)]"
                      : "text-[var(--secondary-dark)]"
                  }`}
                >
                  {userName || "User"}
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
                className="flex-1 bg-transparent outline-none justify-start text-base font-medium leading-normal"
                placeholder="Search..."
              />
              <div className="w-5 h-5">
                <BiSearch className="w-full h-full" />
              </div>
            </div>

            {/* Icons Container */}
            <div className="flex items-center gap-3 justify-center sm:justify-end flex-shrink-0">
              {/* Notifiaction Messages */}
              <button
                onClick={() => setShowNoti((prev) => !prev)}
                className={`transition-colors duration-200 ${
                  isDark
                    ? "hover:text-gray-100 text-gray-300"
                    : "hover:text-gray-800 text-gray-600"
                }`}
              >
                <FaFacebookMessenger className="w-6 h-6" />
              </button>

              {showNoti && <NotificationMessages />}

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "hover:text-yellow-100 text-yellow-300"
                    : "hover:text-gray-800 text-gray-600"
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

        {roles === "Admin" && (
          <div className="fixed right-0 top-1/8 group z-50">
            <div className="relative inline-flex gap-0">
              <button
                type="button"
                onClick={() => setShowModal(!showModal)}
                className={`flex-col h-10 transition text-white py-2 px-4 rounded-l-full text-lg ${
                  isDark
                    ? "bg-[var(--secondary-dark)]"
                    : "bg-[var(--green-dark)]"
                }`}
              >
                <FaTools size={24} />
              </button>
              {/* Modal Sills */}
              <ModalSkills
                open={showModal}
                table={<TableSkills />}
                onClose={() => setShowModal(false)}
                // onSave={(newSkill) => {
                //   setSkills((prev) => [...prev, newSkill]);
                // }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodySystem;

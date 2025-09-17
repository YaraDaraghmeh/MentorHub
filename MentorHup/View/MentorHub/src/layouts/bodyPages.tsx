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

type UserRole = "Admin" | "Mentor" | "Mentee";

const BodySystem = () => {
  const { isDark, toggle } = useTheme();
  const { roles, email, userId, isAuthenticated } = useAuth(); // أضفت isAuthenticated
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // إضافة useEffect للتأكد من أن البيانات محدثة
  useEffect(() => {
    console.log("BodySystem - Auth data updated:", {
      isAuthenticated,
      roles,
      email,
      userId,
    });
  }, [isAuthenticated, roles, email, userId]);

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
          name: email?.split("@")[0] || null, // استخراج اسم من الإيميل كـ fallback
        }}
        role={roles as UserRole}
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
                <span>Hello </span>
                <span
                  className={` ${
                    isDark
                      ? "text-[var(--secondary)]"
                      : "text-[var(--secondary-dark)]"
                  }`}
                >
                  {email || "User"}
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
            <div className="flex items-center gap-2 justify-center sm:justify-end flex-shrink-0">
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
                {/* <span
                  style={{
                    position: "fixed",
                    // top: tooltipPos.top,
                    // left: tooltipPos.left,
                    transform: "translate(-100%, -50%)", // يجي على يسار منتصف الزر
                  }}
                  className=" top-1/4 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none"
                >
                  Manage Skills
                </span> */}
              </button>
              {/* Modal Sills */}
              <ModalSkills
                open={showModal}
                table={<TableSkills />}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodySystem;

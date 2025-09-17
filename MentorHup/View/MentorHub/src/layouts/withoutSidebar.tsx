import { useState, useEffect } from "react";
import SideBar from "../components/SideBar/SideBarDashboard";
import { Outlet } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { FaTools } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import ModalSkills from "../components/Modal/ModalSkills";
import TableSkills from "../components/Tables/tableSkills";

type UserRole = "Admin" | "Mentor" | "Mentee";

const WithoutHeader = () => {
  const { isDark } = useTheme();
  const { roles, email, userId, isAuthenticated } = useAuth(); // أضفت isAuthenticated
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("BodySystem - Auth data updated:", {
      isAuthenticated,
      roles,
      email,
      userId,
    });
  }, [isAuthenticated, roles, email, userId]);

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
          name: email?.split("@")[0] || null,
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
          {/* Main content */}
          <div className="flex-1 ">
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
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithoutHeader;

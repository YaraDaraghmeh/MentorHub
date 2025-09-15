import { useState } from "react";
import SideBar from "../components/SideBar/SideBarDashboard";
import { BiSearch } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { useTheme } from "../Context/ThemeContext";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const userProfile = {
  name: " Sara Sayed Ahmad",
  email: "sara@example.com",
};

const BodySystem = () => {
  const { isDark, toggle } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`min-h-screen w-full ${
        isDark ? "bg-[var(--primary-light)]" : "bg-white"
      }`}
    >
      <SideBar
        profile={userProfile}
        role="mentee"
        expended={isSidebarOpen}
        setExpended={setIsSidebarOpen}
      />

      {/* Main Content Area - Always starts after sidebar space */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen 
            ? "ml-[230px]" // Always push content when sidebar is open
            : "ml-20"      // Smaller margin when sidebar is collapsed
        }`}
        style={{
          // Ensure content never goes under sidebar on mobile
          marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 
            ? (isSidebarOpen ? '0' : '0') 
            : (isSidebarOpen ? '230px' : '80px')
        }}
      >
        {/* Header */}
        <div className="w-full p-4 lg:p-5 relative z-30">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-start lg:items-center max-w-full">
            
            {/* Left side: Menu button + Welcome Message */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
              {/* Mobile Menu Toggle - Only show on mobile */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors flex-shrink-0 z-50 ${
                  isDark 
                    ? "hover:bg-gray-700 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Welcome Message */}
              <div className="flex-shrink min-w-0">
                <div
                  className={`text-sm md:text-base lg:text-lg font-bold leading-7 truncate ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary)]"
                  }`}
                >
                  <span>Hello </span>
                  <span
                    className={`${
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
            </div>

            {/* Right Side: Search + Icons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto items-stretch sm:items-center">
              
              {/* Search Bar */}
              <div
                className={`flex-1 sm:flex-initial w-full sm:w-auto lg:w-[300px] xl:w-[400px] h-10 px-4 py-2 rounded-full border-2 flex justify-between items-center ${
                  isDark
                    ? "border-[var(--primary)] text-[var(--aqua-green)] bg-[var(--primary-rgba)]"
                    : "border-[var(--System-Gray-200)] text-[var(--System-Gray-400)] bg-white"
                }`}
              >
                <input
                  className={`flex-1 text-sm lg:text-base font-medium bg-transparent outline-none placeholder-current ${
                    isDark ? "text-white" : "text-gray-700"
                  }`}
                  placeholder="Search..."
                />
                <BiSearch className="w-5 h-5 flex-shrink-0" />
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-5 relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BodySystem;
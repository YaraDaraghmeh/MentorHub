import profilePicture from "../../assets/avatar-girl-with-glasses.png";
import avatar from "../../assets/avatar-profile.png";
import { MdOutlinePayment } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import ListSide from "./listSide";
import { IoPeople } from "react-icons/io5";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { HiMiniCalendar } from "react-icons/hi2";
import { HiChatAlt2 } from "react-icons/hi";
import { AiOutlineLogin } from "react-icons/ai";
import { HiMenuAlt2 } from "react-icons/hi";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { useAuth } from "../../Context/AuthContext"; // استيراد useAuth
import { NavLink } from "react-router-dom";

interface profile {
  name: string | null;
  email: string | null;
  userId: string | null;
}

type UserRole = "Admin" | "Mentor" | "Mentee";

interface sideProps {
  profile: profile;
  role: UserRole | null;
  expended: boolean;
  setExpended: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({ profile, role, expended, setExpended }: sideProps) => {
  const { logout } = useAuth(); // استخدام logout من AuthContext

  const menuItems = {
    Admin: [
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/admin/dashboard",
      },
      { icon: IoPeople, title: "Users", path: "/admin/users" },
      { icon: HiChatAlt2, title: "Chatting", path: "/admin/chatting" },
      { icon: HiMiniCalendar, title: "Sessions", path: "/admin/sessions" },
      { icon: MdOutlinePayment, title: "Payments", path: "/admin/payment" },
    ],
    Mentor: [
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/mentor/dashboard",
      },
      { icon: HiMiniCalendar, title: "Booking", path: "/mentor/booking" },
      { icon: HiChatAlt2, title: "Chatting", path: "/mentor/chatting" },
    ],
    Mentee: [
      {
        icon: HiHome,
        title: "Main",
        path: "/mentee/main",
      },
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/mentee/dashboard",
      },
      { icon: IoPeople, title: "Mentors", path: "/mentee/mentors" }, // غيرت من dashboard1 إلى mentors
      { icon: HiMiniCalendar, title: "Booking", path: "/mentee/booking" },
      { icon: HiChatAlt2, title: "Chatting", path: "/mentee/chatting" },
    ],
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpended(false);
        setIsMobile(true);
      } else {
        setExpended(true);
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // call once on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setExpended]); // أضفت setExpended للـ dependency array

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-[var(--primary)] py-[22px] overflow-hidden flex flex-col z-20 transition-[width] duration-300 ${
          expended ? "w-[230px]" : "w-20"
        }`}
      >
        <nav className="flex flex-col flex-1">
          <span
            className={`flex w-full px-6 text-white cursor-pointer ${
              expended ? " justify-end" : " pb-2 justify-center"
            }`}
            onClick={() => {
              setExpended(!expended);
            }}
          >
            {expended ? (
              <HiMenuAlt3 className="text-xl" />
            ) : (
              <HiMenuAlt2 className="text-xl" />
            )}
          </span>

          {/* header */}
          <div
            className={`w-full py-3 border-b border-[var(--primary-light)] flex flex-col items-center gap-2.5 ${
              expended ? "" : "pl-2"
            }`}
          >
            <div
              className={`${
                expended ? "w-[112px] h-[112px]" : "w-[28px] h-[28px]"
              }`}
            >
              {role && (
                <a href={`${role}/profile`}>
                  <img
                    src={expended ? profilePicture : avatar}
                    alt="User Avatar"
                    className={`w-full h-full rounded-full overflow-hidden transition`}
                  />
                </a>
              )}
            </div>
            {expended ? (
              <div className="flex flex-col gap-1 items-center">
                <span className="text-[var(--secondary-light)] text-base font-bold">
                  {profile.name || "المستخدم"}
                </span>
                <span className="text-[var(--primary-green-light)] text-sm font-normal">
                  {profile.email}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>

          <div
            className={`pt-[18px] flex flex-col flex-1 justify-between text-[var(--secondary-light)] ${
              expended ? "pl-7" : "pl-4"
            }`}
          >
            {/* list nav */}
            <ul className={`w-full flex flex-col gap-3`}>
              {role &&
                menuItems[role].map((item, index) => (
                  <ListSide key={index} link={item.path} expended={expended}>
                    <item.icon className="w-6 h-6" />
                    {expended ? item.title : ""}
                  </ListSide>
                ))}
            </ul>

            {/* setting / logout */}
            <div className={expended ? "p-4" : "p-0"}>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 cursor-pointer hover:text-[var(--secondary)] transition-all ${
                  expended ? "justify-start pl-3" : "justify-center pl-2"
                } bg-transparent border-none`}
              >
                <AiOutlineLogin className="w-6 h-6" />
                <span className="ml-2">{expended ? "Logout" : ""}</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile */}
      {isMobile && expended && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setExpended(false)}
        />
      )}
    </>
  );
};

export default SideBar;

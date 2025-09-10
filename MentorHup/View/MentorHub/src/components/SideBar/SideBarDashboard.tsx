import profilePicture from "../../assets/avatar-girl-with-glasses.png";
import avatar from "../../assets/avatar-profile.png";
import { HiMenuAlt3 } from "react-icons/hi";
import ListSide from "./listSide";
import { IoPeople } from "react-icons/io5";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { HiMiniCalendar } from "react-icons/hi2";
import { HiChatAlt2 } from "react-icons/hi";
import { AiOutlineLogin } from "react-icons/ai";
import { HiMenuAlt2 } from "react-icons/hi";
import { useEffect, useState } from "react";

interface profile {
  name: string;
  email: string;
}

type UserRole = "admin" | "mentor" | "mentee";

interface sideProps {
  profile: profile;
  role: UserRole;
  isDark: boolean;
  expended: boolean;
  setExpended: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({
  profile,
  role,
  expended,
  setExpended,
  isDark,
}: sideProps) => {
  const menuItems = {
    admin: [
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/admin/dashboard",
      },
      { icon: IoPeople, title: "Users", path: "/admin/users" },
      { icon: HiChatAlt2, title: "Chatting", path: "/admin/chatting" },
      { icon: HiMiniCalendar, title: "Booking", path: "/admin/booking" },
    ],
    mentor: [
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/mentor/dashboard",
      },
      { icon: HiMiniCalendar, title: "Booking", path: "/mentor/booking" },
      { icon: HiChatAlt2, title: "Chatting", path: "/mentor/chatting" },
    ],
    mentee: [
      {
        icon: RiDashboardHorizontalLine,
        title: "Dashboard",
        path: "/mentee/dashboard",
      },
      { icon: IoPeople, title: "Mentors", path: "/mentee/dashboard" },
      { icon: HiMiniCalendar, title: "Booking", path: "/mentee/booking" },
      { icon: HiChatAlt2, title: "Chatting", path: "/mentee/chatting" },
    ],
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpended(false);
      } else {
        setExpended(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // call once on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              <img
                src={expended ? profilePicture : avatar}
                alt={avatar}
                className={`w-full h-full rounded-full overflow-hidden transition`}
              />
            </div>
            {expended ? (
              <div className="flex flex-col gap-1 items-center">
                <span className="text-[var(--secondary-light)] text-base font-bold">
                  {profile.name}
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
              {menuItems[role].map((item, index) => (
                <ListSide
                  key={index}
                  link={item.path}
                  isDark={isDark}
                  expended={expended}
                >
                  <item.icon className="w-6 h-6" />
                  {expended ? item.title : ""}
                </ListSide>
              ))}
            </ul>

            {/* setting / logout */}
            <div className={expended ? "p-4" : "p-0"}>
              <button
                className={`w-full flex items-center gap-3 cursor-pointer hover:text-[var(--secondary)] transition ${
                  expended ? "justify-start pl-3" : "justify-center pl-2"
                }`}
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
          className="fixed inset-0 bg-black bg-opacity-70 z-10"
          onClick={() => setExpended(false)}
        />
      )}
    </>
  );
};

export default SideBar;

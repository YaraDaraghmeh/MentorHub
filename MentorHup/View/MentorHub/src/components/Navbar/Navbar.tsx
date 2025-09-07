import { useState } from "react";
import "./Navbar.css";
import ListItem from "./list";
import logo from "/src/assets/MentorHub-logo (1)/cover.png";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";

interface NavProps {
  isDark?: boolean;
  toggleTheme?: () => void;
}

const Nav = ({ isDark = false, toggleTheme }: NavProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Mentors", path: "/browsMentor" },
    { title: "Contact Us", path: "/contactUs" },
    { title: "Join Us", path: "/joinUs" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 lg:px-[45px] md:px-[38px] px-6 bg-dark flex flex-shrink-0 items-center justify-between w-full">
      {/* logo */}
      <Link to="/" className="flex items-center">
        <img
          className="cursor-pointer h-10 w-auto cursor-pointer object-contain"
          src={logo}
        />
      </Link>

      {/* list navbar */}
      <div className="md:flex hidden md:w-auto items-center px-5 transition-all duration-300 z-50">
        <ul className="flex md:flex-row flex-col md:items-center justify-center lg:gap-[12px] md:gap-[4px] gap-1">
          {navLinks.map((link) => (
            <ListItem link={link.path}>{link.title}</ListItem>
          ))}
        </ul>
      </div>

      {/* theme & Sign in */}
      <div className="flex items-center justify-center self-stretch gap-3 p-2">
        <button
          onClick={toggleTheme}
          className="hidden md:flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <BsSunFill className="lg:w-[24px] lg:h-[24px] md:w-[22px] md:h-[22px] text-yellow-400" />
          ) : (
            <BsMoonFill className="lg:w-[24px] lg:h-[24px] md:w-[22px] md:h-[22px] text-gray-300" />
          )}
        </button>
        <button
          onClick={handleClick}
          className="btn-nav hidden md:flex items-center justify-center gap-2"
        >
          <h5 className="lg:text-[14px] md:text-[13px]">Sign in</h5>
          <IoIosArrowForward />
        </button>
        <span
          onClick={() => setOpen(!open)}
          className="text-3xl cursor-pointer md:hidden"
        >
          {open ? <IoClose /> : <IoMenu />}
        </span>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed left-0 w-full bg-dark transition-all duration-300 overflow-auto z-40 ${
            open ? "top-16 max-h-screen" : "top-16 max-h-0"
          }`}
      >
        <ul className="flex flex-col items-center gap-[20px] py-6">
          {navLinks.map((link) => (
            <li className="flex-col items-center md:p-2 lg:text-[14px] md:text-[13px] w-full">
              <NavLink
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? "activeMobile w-full items-center py-4" : ""
                }
              >
                {link.title}
              </NavLink>
            </li>
          ))}
          <li className="flex items-center justify-center w-full py-4">
            <button
              onClick={() => {
                toggleTheme?.();
                setOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursuor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <BsSunFill className="w-6 h-6 text-yellow-300" />
              ) : (
                <BsMoonFill className="w-6 h-6 text-gray-300" />
              )}
              <span className="text-sm">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

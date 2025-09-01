// import { useState } from "react";
import "./Navbar.css";
import ListItem from "./list";
import logo from "/src/assets/MentorHub-logo (1)/cover.png";
import { BsMoonFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";

const Nav = () => {
  return (
    <nav className="relative bg-dark flex flex-shrink-0 self-stretch items-center justify-between w-full">
      <a className="flex items-start">
        <img src={logo} />
      </a>
      <ul className="flex items-center justify-center h-full self-stretch h-full w-full gap-3">
        <ListItem link="/"> Home</ListItem>
        <ListItem link="/about"> About</ListItem>
        <ListItem link="/browsMentor"> Brows Mentors</ListItem>
        <ListItem link="/contactUs"> Contact Us</ListItem>
        <ListItem link="/joinUs"> Join Us</ListItem>
      </ul>
      <div className="flex items-center justify-center self-stretch gap-3 p-2">
        <span className="flex-col items-center">
          <BsMoonFill style={{ width: "24px", height: "24px" }} />
        </span>
        <button className="flex items-center justify-center gap-2">
          <h5>Sign in</h5>
          <IoIosArrowForward />
        </button>
      </div>
    </nav>
  );
};

export default Nav;

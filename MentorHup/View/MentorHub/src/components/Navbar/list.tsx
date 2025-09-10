import type { MouseEventHandler } from "react";
import type React from "react";
import { NavLink } from "react-router-dom";

type ListItemProps = {
  children: React.ReactNode;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function ListItem({ link, children, onClick }: ListItemProps) {
  return (
    <li className="flex-col items-center lg:p-3 md:p-2 lg:text-[14px] md:text-[13px] list-nav">
      <NavLink
        to={link}
        onClick={onClick}
        className={({ isActive }) =>
          isActive ? "active flex-col items-center py-[22px]" : ""
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

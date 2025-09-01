import type React from "react";
import { NavLink } from "react-router-dom";

type ListItemProps = {
  children: React.ReactNode;
  link: string;
};

export default function ListItem({ link, children }: ListItemProps) {
  return (
    <li className="flex-col items-center p-3">
      <NavLink
        to={link}
        className={({ isActive }) => (isActive ? ".active" : "")}
      >
        {children}
      </NavLink>
    </li>
  );
}

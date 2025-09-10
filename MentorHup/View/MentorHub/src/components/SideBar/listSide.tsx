import { type MouseEventHandler } from "react";
import type React from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";

type ListItemProps = {
  expended: boolean;
  isDark: boolean;
  children: React.ReactNode;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const ListSide = ({
  link,
  children,
  isDark,
  expended,
  onClick,
}: ListItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <li
      className={clsx(
        "w-full rounded-tl-[20px] rounded-bl-[20px] flex items-center gap-2 hover:text-[var(--secondary)] transition-colors group ",
        isActive && isDark && "bg-[var(--primary-light)]",
        isActive && !isDark && "bg-white text-[var(--primary)]",
        !isActive && isDark && "bg-[var(--primary)]",
        !isActive && !isDark && "bg-[var(--primary)]",
        expended
          ? "justify-start md:px-6 md:py-2 px-4 py-1"
          : "justify-start px-4 py-1"
      )}
    >
      <NavLink
        to={link}
        onClick={onClick}
        className="flex flex-row gap-2 jutify-center items-center text-base font-semibold"
      >
        {children}
      </NavLink>
    </li>
  );
};

export default ListSide;

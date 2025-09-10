import "./Footer.css";
import { FaCopyright } from "react-icons/fa";

const Footer = ({ isDark = true }) => {
  return (
    <footer
      className={`relative flex w-full flex-shrink-0 self-stretch items-center justify-between flex-wrap 
      ${isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--primary-green-light)]"}
    `}
    >
      <div className="flex flex-row items-centers justify-center w-full gap-4">
        <div className="flex flex-col flex-wrap gap-2">
          <span
            className={`${
              isDark ? "text-[var(--gray-light)] " : "text-[var(--primary)]"
            } `}
          >
            Technical Support & Help
          </span>
          <span
            className={`${
              isDark ? "text-[var(--primary-light)]" : "text-[var(--accent)]"
            } `}
          >
            support@mentorhub.com
          </span>
        </div>
        <div className="flex flex-col flex-wrap gap-2">
          <span
            className={`${
              isDark ? "text-[var(--gray-light)]" : "text-[var(--primary)]"
            } `}
          >
            Business Inquiries & Partnerships
          </span>
          <span
            className={`${
              isDark ? "text-[var(--primary-light)]" : "text-[var(--accent)]"
            } `}
          >
            business@mentorhub.com
          </span>
        </div>
      </div>
      <div className="flex flex-row items-centers justify-center w-full gap-4">
        <span
          className={` ${
            isDark ? "text-[var(--accent)]" : "text-[var(--gray-dark)]"
          }`}
        >
          Privacy Policy
        </span>
        <span
          className={` ${
            isDark ? "text-[var(--accent)]" : "text-[var(--gray-dark)]"
          }`}
        >
          Terms of Service
        </span>
      </div>
      <div className="flex items-centers justify-center w-full gap-2">
        <FaCopyright className="copyright" />
        <span
          className={`${
            isDark ? "text-[var(--secondary)]" : "text-[var(--primary-light)]"
          }`}
        >
          2025, made by
        </span>
        <b
          className={`${
            isDark
              ? "text-[var(--secondary-light)]"
              : "text-[var(--green-dark)]"
          }`}
        >
          SKAY
        </b>
      </div>
    </footer>
  );
};

export default Footer;

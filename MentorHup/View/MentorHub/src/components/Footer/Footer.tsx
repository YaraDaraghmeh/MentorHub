import "./Footer.css";
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative flex w-full flex-shrink-0 self-stretch items-center justify-between flex-wrap ">
      <div className="flex flex-row items-centers justify-center w-full gap-4">
        <div className="flex flex-col flex-wrap gap-2">
          <span className="title">Technical Support & Help</span>
          <span>support@mentorhub.com</span>
        </div>
        <div className="flex flex-col flex-wrap gap-2">
          <span className="title">Business Inquiries & Partnerships</span>
          <span>business@mentorhub.com</span>
        </div>
      </div>
      <div className="flex flex-row items-centers justify-center w-full gap-4">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
      <div className="flex items-centers justify-center w-full gap-2">
        <FaCopyright className="copyright" />
        <span className="year">2025, made by </span>
        <b>SKAY</b>
      </div>
    </footer>
  );
};

export default Footer;

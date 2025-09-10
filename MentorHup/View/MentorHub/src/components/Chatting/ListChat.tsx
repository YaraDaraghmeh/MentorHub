import CardChat from "./cardChatting";
import "./Chatting.css";
import { IoMenu } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { useTheme } from "../../Context/ThemeContext";

const ListOfChat = () => {
  const { isDark } = useTheme();
  return (
    <div
      className={`shadow flex md:flex-col md:flex-nowrap flex-wrap flex-row md:h-full md:w-[400px] w-full h-[600px] justify-start items-start lg:gap-[24px] gap-3 px-[22px] py-[12px] rounded-[54px] overflow-hidden ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
      }`}
    >
      {/* Header List Chat */}
      <div className="self-stretch h-36 p-2 flex flex-col justify-center items-start gap-2 w-full">
        <div
          className={`self-stretch flex-1 inline-flex justify-between items-center w-full ${
            isDark ? "text-[var(--secondary-light)]" : "text-[var(--primary)]"
          }`}
        >
          <h2 className={`justify-center text-xl font-bold`}>Message</h2>
          <span className="w-6 h-6 relative overflow-hidden">
            <IoMenu className="w-full h-full" />
          </span>
        </div>
        <div
          className={`search self-stretch h-12 p-3.5 rounded-[52px] inline-flex justify-between items-center overflow-hidden ${
            isDark
              ? "bg-[var(--primary-light)] text-[var(--aqua-green)]"
              : "bg-[var(--gray-lighter)] text-[var(--System-Gray-400)]"
          }`}
        >
          <input
            className="justify-start leading-normal text-base font-medium "
            placeholder="Search..."
          />
          <BiSearch className="w-[22px] h-[22px]" />
        </div>
      </div>

      {/* List Chatting */}
      <div
        className={`w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent flex-col flex self-stretch justify-start items-start gap-2
         ${
           isDark
             ? "scrollDark bg-[var(--primary-rgba)]"
             : "scrollLi bg-[var(--secondary-light)]"
         }`}
      >
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={true}
        />
      </div>
    </div>
  );
};

export default ListOfChat;

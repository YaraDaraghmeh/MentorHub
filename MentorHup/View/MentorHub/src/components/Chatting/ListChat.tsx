import CardChat from "./cardChatting";
import "./Chatting.css";
import { IoMenu } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";

const ListOfChat = ({ isDark = false }) => {
  return (
    <div
      className={`shadow col-span-1 md:h-full h-full justify-start items-start lg:gap-[24px] gap-3 px-[22px] py-[12px] rounded-[54px] overflow-hidden ${
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
        className={`w-full h-full pb-2 flex-col flex self-stretch justify-start items-start gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent 
         ${
           isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
         }`}
      >
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
        <CardChat
          name="Mr Jon"
          time="9:30 AM"
          message="Thanks for your understanding"
          picture=" "
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default ListOfChat;

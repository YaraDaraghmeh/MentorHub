import Chatting from "./BoxChatting";
import ListOfChat from "./ListChat";
import { useTheme } from "../../Context/ThemeContext";
import { useState } from "react";
import type { conv, message } from "../Tables/interfaces";
import logo from "../../assets/MentorHub-logo (1)/vector/default-monochrome.svg";
// import pictureProfile from "../../assets/avatar-profile.png";

const Chat = () => {
  const { isDark } = useTheme();

  const [activeChat, setActiveChat] = useState<conv | null>(null);
  const [allMessage, setAllMessage] = useState<message[]>([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full md:h-[600px] justify-start items-center gap-6">
      <ListOfChat
        onSelectChat={(chat, msgs) => {
          setActiveChat(chat);
          setAllMessage(msgs);
        }}
      />
      {activeChat ? (
        <Chatting
          ReceiverId={activeChat.conversationWithId}
          messages={allMessage}
          name={activeChat.conversationWithName}
          picture={activeChat.conversationWithAvatar}
        />
      ) : (
        <div
          className={`shadow col-span-2 h-full p-3 lg:block hidden overflow-hidden rounded-[54px] ${
            isDark
              ? "bg-[var(--primary-rgba)] text-[var(--secondary-light)]"
              : "bg-[var(--secondary-light)] text-[var(--primary-rgba)]"
          }`}
        >
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <img src={logo} className="w-lg" />
            <h1 className="text-2xl flex flex-col font-bold">
              <span>Welcome! We’re here to help you </span>
              <span>connect with everyone.</span>
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

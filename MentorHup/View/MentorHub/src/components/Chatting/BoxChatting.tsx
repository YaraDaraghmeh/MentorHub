import pictureProfile from "../../assets/avatar-profile.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageReceive from "./MessageReceive";
import MessageSend from "./MessageSend";
import { useTheme } from "../../Context/ThemeContext";
import type { message } from "../Tables/interfaces";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import urlChatting from "../../Utilities/Chatting/urlChatting";

type ListInfo = {
  ReceiverId: string;
  name: string;
  picture?: string;
  messages: message[];
};

interface sendMessage {
  Content: string;
  ReceiverId: string;
}

const Chatting = ({ name, ReceiverId, picture, messages }: ListInfo) => {
  const { isDark } = useTheme();
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState<sendMessage>({
    ReceiverId: ReceiverId,
    Content: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMessage((pr) => ({ ...pr, [name]: value }));

    console.log(message);
  };

  // button send
  const handleSend = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const resp = await axios.post(
        urlChatting.GET_MESSAGE,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response data:", resp.data);
    } catch (error: any) {
      console.log("send message", error);
    }
  };

  return (
    <>
      <div className="shadow col-span-2 justify-start items-start lg:block hidden overflow-hidden rounded-[54px]">
        {/* Header */}
        <div
          className={`flex h-24 px-[21px] py-2 rounded-tl-[53px] rounded-tr-[53px] border-b border-[var(--primary-green-light)] justify-between items-center ${
            isDark
              ? "text-[var(--secondary)] bg-[var(--primary-rgba)]"
              : "text-[var(--primary)] bg-[var(--secondary-light)]"
          }`}
        >
          {/* picute & name */}
          <div className="inline-flex justify-start items-center gap-2.5">
            <img
              className="w-14 h-14 rounded-full"
              src={picture || pictureProfile}
              alt={picture}
            />
            <h3 className="text-[var(--secondary)] text-base font-medium">
              {name}
            </h3>
          </div>

          {/* setting */}
          <div className="w-6 h-6 relative overflow-hidden">
            <BsThreeDotsVertical className="w-[22px] h-[22px]" />
          </div>
        </div>

        {/* body chat */}
        <div
          className={`flex flex-col w-full h-[500px] gap-[8px] ${
            isDark ? "bg-[var(--primary-light)]" : "bg-[var(--white)]"
          }`}
        >
          {/* Messages */}
          <div
            className={`flex flex-col-reverse overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent gap-5 p-4 ${
              isDark ? "scrollDark" : "scrollLi"
            }`}
          >
            {messages
              .slice()
              .reverse()
              .map((msg) =>
                msg.senderId === userId ? (
                  <MessageSend message={msg.content} />
                ) : (
                  <MessageReceive
                    message={msg.content}
                    picture={picture || pictureProfile}
                  />
                )
              )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4">
            <div
              className={`flex w-full items-center px-4 py-2 shadow rounded-3xl ${
                isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--white)]"
              }`}
            >
              <input
                className={`flex-1 placeholder-[var(--System-Gray-300)] bg-transparent outline-none ${
                  isDark
                    ? "text-[var(--aqua-green)]"
                    : "text-[var(--primary-light)]"
                }`}
                placeholder="Type a message"
                name="Content"
                value={message.Content}
                onChange={handleChange}
              />

              {/* button for send */}
              <button
                onClick={handleSend}
                disabled={!message.Content.trim()}
                className={`
                    p-2
                    transition-all duration-200 
                    ${
                      message.Content
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-90 pointer-events-none"
                    }
                    hover:scale-105
                  `}
              >
                <IoSend
                  className={`${
                    isDark
                      ? "text-[var(--aqua-green)]"
                      : "text-[var(--primary-light)]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;

import CardChat from "./cardChatting";
import "./Chatting.css";
import { IoMenu } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import urlChatting from "../../Utilities/Chatting/urlChatting";
import profile from "../../assets/avatar-profile.png";

interface conv {
  conversationWithAvatar: string;
  conversationWithId: string;
  conversationWithName: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead: boolean;
}

interface message {
  id: number;
  content: string;
  senderId: string;
  receiverId: string;
  sentAt: string;
  isRead: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface listOfChat {
  onSelectChat: (chat: conv, msg: message[]) => void;
}

const ListOfChat = ({ onSelectChat }: listOfChat) => {
  const { isDark } = useTheme();
  const [conversation, setConverstaion] = useState<conv[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState({ name: "" });
  const token = localStorage.getItem("accessToken");

  // get all conversation
  const getConversation = async () => {
    try {
      const convers = await axios.get(urlChatting.GET_ALL_CONVERSATION, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConverstaion(convers.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversation();

    const idUser = localStorage.getItem("MessageIdUser") || "";
    const userName = localStorage.getItem("MessageUserName") || "";
    const avater = localStorage.getItem("imageUser") || "";

    if (idUser && userName) {
      setActiveChatId(idUser);

      const selectChat: conv = {
        conversationWithId: idUser,
        conversationWithName: userName,
        conversationWithAvatar: avater || profile,
        lastMessage: "",
        lastMessageTime: "",
        isRead: true,
      };

      axios
        .get(`${urlChatting.GET_MESSAGE}/${idUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          onSelectChat(selectChat, resp.data);
        })
        .catch((error: any) => console.log("get message: ", error));
    }
  }, []);

  // edit time
  const formatTime = (datetime: string) => {
    const [, time] = datetime.split("T");
    return time.split(".")[0];
  };

  // choice specific conversation
  const handleSpecifcMessage = async (chat: conv) => {
    try {
      const getConver = await axios.get(
        `${urlChatting.GET_MESSAGE}/${chat.conversationWithId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSelectChat(chat, getConver.data);
    } catch (error: any) {
      console.log("get messages: ", error);
    }
  };

  // Search specific user
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch((pr) => ({ ...pr, [name]: value }));

    console.log(search);
  };

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
            name="content"
            className="justify-start leading-normal text-base font-medium "
            placeholder="Search..."
            value={search.name}
            onChange={(e) => handleChange(e)}
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
        {conversation.map((chat) => (
          <CardChat
            key={chat.conversationWithId}
            isRead={chat.isRead}
            name={chat.conversationWithName}
            time={formatTime(chat.lastMessageTime)}
            message={chat.lastMessage}
            picture={chat.conversationWithAvatar || profile}
            isDark={isDark}
            isActive={activeChatId === chat.conversationWithId}
            onClick={() => handleSpecifcMessage(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListOfChat;

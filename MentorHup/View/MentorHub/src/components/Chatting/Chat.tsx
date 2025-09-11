import Chatting from "./BoxChatting";
import ListOfChat from "./ListChat";
import { useTheme } from "../../Context/ThemeContext";
  
const Chat = () => {
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full md:h-[600px] justify-start items-center gap-6">
      <ListOfChat />
      <Chatting  name={"Mr Jon"} picture={""} />
    </div>
  );
};

export default Chat;

import Chatting from "./BoxChatting";
import ListOfChat from "./ListChat";

const Chat = () => {
  return (
    <div className="flex flex-row w-full md:flex-nowrap md:h-[700px] flex-wrap justify-start items-center gap-6">
      <ListOfChat />
      <Chatting isDark={true} name={"Mr Jon"} picture={""} />
    </div>
  );
};

export default Chat;

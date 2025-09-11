import pictureProfile from "../../assets/avatar-girl-with-glasses.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageReceive from "./MessageReceive";
import MessageSend from "./MessageSend";
import { useTheme } from "../../Context/ThemeContext";

type ListInfo = {
  name: string;
  picture?: string;
};

const Chatting = ({ name, picture }: ListInfo) => {
  const { isDark } = useTheme();
  return (
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
            src={pictureProfile}
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
        className={`flex flex-col flex-wrap w-full h-[500px] gap-[8px] ${
          isDark ? "bg-[var(--primary-light)]" : "bg-[var(--white)]"
        }`}
      >
        {/* Message */}
        <div
          className={`flex flex-col-reverse flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent text-[var(--secondary-light)] gap-5 p-4
            ${isDark ? "scrollDark" : "scrollLi"}`}
        >
          <MessageSend message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet." />

          <MessageReceive
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet."
            picture=""
          />

          <MessageSend message="Lorem ipsum dolor sit amet, consectetur adipiscing elit 😊✔️" />

          <MessageReceive
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet."
            picture=""
          />
        </div>

        {/* input */}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;

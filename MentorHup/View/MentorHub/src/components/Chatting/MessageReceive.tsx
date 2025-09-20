import pictureProfile from "../../assets/avatar-girl-with-glasses.png";
import { useTheme } from "../../Context/ThemeContext";

type listData = {
  message: string;
  picture?: string;
};

const MessageReceive = ({ message, picture }: listData) => {
  const { isDark } = useTheme();
  return (
    <div className="w-full flex items-start gap-2 mb-2">
      {/* picture */}
      <img
        className="w-10 h-10 rounded-full"
        src={picture || pictureProfile}
        alt="profile"
      />

      {/* message */}
      <div
        className={`max-w-xs p-3 rounded-3xl ${
          isDark
            ? "bg-[var(--dark-desaturated-cyan-green)] text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <p className="text-base font-medium">{message}</p>
      </div>
    </div>
  );
};

export default MessageReceive;

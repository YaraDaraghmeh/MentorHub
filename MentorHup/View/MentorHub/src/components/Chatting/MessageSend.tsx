type listData = {
  message: string;
};
import { useTheme } from "../../Context/ThemeContext";

const MessageSend = ({ message }: listData) => {
  const { isDark } = useTheme();
  return (
    <div className="w-full flex justify-end mb-2">
      <div
        className={`max-w-xs p-3 rounded-3xl ${
          isDark
            ? "bg-[var(--System-Gray-700)] text-white"
            : "bg-[var(--primary)] text-white"
        }`}
      >
        <p className="text-base font-medium">{message}</p>
      </div>
    </div>
  );
};

export default MessageSend;

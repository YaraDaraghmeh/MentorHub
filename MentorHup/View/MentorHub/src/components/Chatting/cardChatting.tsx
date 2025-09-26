import { useTheme } from "../../Context/ThemeContext";

type ListInfo = {
  picture?: string;
  name: string;
  time: string;
  message: string;
  isRead: boolean;
  isDark: boolean;
  isActive: boolean;
  onClick: () => void;
};

const CardChat = ({
  picture,
  name,
  time,
  message,
  isRead,
  isActive,
  onClick,
}: ListInfo) => {
  const { isDark } = useTheme();

  return (
    <div
      onClick={onClick}
      className="p-1.5 transition-transform duration-150 active:scale-95 w-full"
    >
      <div
        className={`w-full h-[86px] flex justify-center items-center gap-2 overflow-hidden rounded-[22px] outline outline-2 p-[10px] cursor-pointer transition-all duration-300 ${
          isActive && isDark
            ? "bg-[var(--primary-rgba)] outline-[var(--gray-light)]"
            : isActive && !isDark
            ? "bg-[var(--white)] outline-[var(--secondary-dark)]"
            : !isActive && isDark
            ? "bg-[var(--primary-rgba)] outline-[var(--primary-light)]"
            : "bg-[var(--white)] outline-[var(--primary-green-light)]"
        }`}
      >
        <div className="w-14 h-14 rounded-full">
          <img
            src={picture}
            className="w-full h-full rounded-full"
            alt={picture}
          />
        </div>
        <div className="flex-1 text-start self-stretch px-2 flex flex-wrap justify-start items-start gap-2.5 overflow-hidden">
          {/* information person */}
          <div className="self-stretch inline-flex justify-between items-center w-full">
            <h3
              className={`justify-start text-base font-bold leading-normal ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)] "
              }`}
            >
              {name}
            </h3>
            <span className="p-1.5 inline-flex flex-col justify-start items-start overflow-hidden ">
              <span className="text-[var(--secondary-dark)] text-xs font-semibold leading-none">
                {time}
              </span>
            </span>
          </div>

          {/* Message */}
          <div
            className={`justify-start truncate max-w-[200px] text-sm font-medium leading-tight ${
              isRead ? "text-[var(--accent)]" : "text-[var(--green-dark)]"
            }`}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardChat;

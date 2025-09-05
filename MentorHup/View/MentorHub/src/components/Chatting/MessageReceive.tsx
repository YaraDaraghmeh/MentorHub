import pictureProfile from "../../assets/avatar-girl-with-glasses.png";

type listData = {
  isDark: boolean;
  message: string;
  picture?: string;
};

const MessageReceive = ({ isDark = false, message, picture }: listData) => {
  return (
    <div className="w-full inline-flex flex-col h-auto flex-wrap justify-center items-start text-start gap-2">
      <div className="w-96 h-auto inline-flex justify-center items-start gap-3">
        {/* picute */}
        <div className="w-14 h-14 rounded-full">
          <img className="w-full h-full" src={pictureProfile} alt={picture} />
        </div>

        {/* message */}
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-[5px]">
          <div
            className={`w-auto h-auto self-stretch p-3 rounded-3xl flex flex-col justify-start items-start gap-3 overflow-hidden ${
              isDark
                ? "bg-[var(--dark-desaturated-cyan-green)]"
                : "bg-[var(--primary-rgba)]"
            }`}
          >
            <p className="self-stretch justify-start text-base font-medium">
              {message}
            </p>
          </div>
          <div
            className={`w-auto h-auto self-stretch p-3 rounded-3xl flex flex-col justify-start items-start gap-3 overflow-hidden ${
              isDark
                ? "bg-[var(--dark-desaturated-cyan-green)]"
                : "bg-[var(--primary-rgba)]"
            }`}
          >
            <p className="self-stretch justify-start text-base font-medium">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReceive;

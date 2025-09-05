type listData = {
  isDark: boolean;
  message: string;
};

const MessageSend = ({ isDark = false, message }: listData) => {
  return (
    <div className="w-full inline-flex flex-col h-auto flex-wrap justify-center items-end gap-2 text-end">
      <div className="w-96 h-auto inline-flex justify-center items-start gap-3">
        <div className="w-auto flex-1 inline-flex flex-col justify-center items-end gap-[5px]">
          <div
            className={`w-auto h-auto self-stretch p-3 rounded-3xl flex flex-col justify-start items-start gap-3 overflow-hidden ${
              isDark ? "bg-[var(--System-Gray-700)]" : "bg-[var(--primary)]"
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

export default MessageSend;

import axios from "axios";
import { useEffect, useState } from "react";
import urlNotification from "../../Utilities/Chatting/urlNotification";
import { useTheme } from "../../Context/ThemeContext";
import FormatTime from "../Chatting/FormateTime";
import type { notification } from "../Tables/interfaces";
import { useSignalRChat } from "../../Services/chatConnection";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";

const NotificationMessages = () => {
  const { isDark } = useTheme();
  const [allNotification, setAllNotification] = useState<notification[]>([]);
  const { notificaConnection, isConnected } = useSignalRChat(
    localStorage.getItem("accessToken") || ""
  );
  const [settingNot, setSetting] = useState({
    id: 0,
    isRead: false,
    show: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getAllNotifications = async () => {
      try {
        const res = await axios.get(urlNotification.NOTIFICATION, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllNotification(res.data);
      } catch (error: any) {
        console.log("Notification error: ", error);
      }
    };

    getAllNotifications();

    if (notificaConnection && isConnected) {
      notificaConnection.on(
        "ReceiveNotification",
        (notification: notification) => {
          setAllNotification((prev) => [
            { ...notification, isRead: false },
            ...prev,
          ]);
        }
      );
    }

    return () => {
      if (notificaConnection) {
        notificaConnection.off("ReceiveNotification");
      }
    };
  }, []);

  const handleSetting = (id: number, isRead: boolean) => {
    setSetting((prev) => ({
      id,
      isRead,
      show: prev.id === id ? !prev.show : true,
    }));
  };

  return (
    <div
      className="rounded-lg overflow-hidden fixed top-14 right-16 z-100 w-[28rem] flex flex-col justify-center items-center  transition-all duration-300 ease-in-out transform animate-slide-down"
      style={{ boxShadow: "1px 2px 12px #f1b3bfff" }}
    >
      <div className={`w-full h-110 ${isDark ? "bg-[]" : "bg-white"}`}>
        {/* header */}
        <div
          className={`w-full flex flex-row items-center p-3 border-b-2 gap-2 ${
            isDark
              ? "bg-[var(--secondary-light)]"
              : "border-[var(--primary-green-light)] bg-[var(--secondary-light)]"
          }`}
        >
          <h2
            className={`font-bold text-lg ${
              isDark ? "text-[var(--secondary-light)]" : "text-[var(--primary)]"
            }`}
          >
            Notifications
          </h2>
          <span
            className={`font-semibold text-md ${
              isDark ? "text-[var(--)]" : "text-[var(--System-Gray-700)]"
            }`}
          >
            |
          </span>
          <h4
            className={`text-sm mt-1 ${
              isDark ? "text-[var(--)]" : "text-[var(--accent)]"
            }`}
          >
            Messages
          </h4>
        </div>

        {/* Notifications */}
        <div
          className={`flex flex-col w-full border h-full overflow-y-auto  ${
            isDark ? "border-[]" : "border-[var(--primary-green-light)]"
          }`}
          style={{ scrollbarColor: "black lightgray", scrollbarWidth: "thin" }}
        >
          {allNotification.map((not) => (
            <div
              key={not.id}
              className={`w-full flex flex-row p-3 border-b-2 justify-between min-h-20 group relative cursor-pointer ${
                isDark
                  ? "border-[var(--primary-green-light)]"
                  : "border-[var(--primary-green-light)]"
              }`}
            >
              <div className="flex flex-col flex-1 justify-between">
                <h3
                  className={`text-start text-[15px] ${
                    isDark ? "text-[]" : "text-[var(--primary-rgba)]"
                  }`}
                >
                  {not.title}
                </h3>
                <h4
                  className={`text-start text-sm ${
                    isDark ? "text-[]" : "text-[var(--accent)]"
                  }`}
                >
                  {not.message}
                </h4>
              </div>
              <span
                className={`ml-2 text-sm self-start ${
                  isDark ? "text-[]" : "text-[var(--secondary-dark)]"
                }`}
              >
                {FormatTime(not.createdAt)}
              </span>
              {/* is not read */}
              {!not.isRead ? (
                <span className="pt-6 pl-2">
                  <GoDotFill
                    className={`w-5 h-5 ${
                      isDark
                        ? "text-[var(--secondary-light)]"
                        : "text-[var(--blue-medium)]"
                    }`}
                  />
                </span>
              ) : null}

              <div className="relative">
                <button
                  className={`opacity-0 mt-5.5 p-1 group-hover:opacity-100 transition-opacity duration-300 rounded-full border-1 h-fit ${
                    isDark
                      ? "bg-[]"
                      : "bg-[var(--secondary-light)] border-[var(--Philippine)]"
                  }`}
                  onClick={() => handleSetting(not.id, not.isRead)}
                >
                  <BsThreeDotsVertical
                    className={`w-4 h-4 ${
                      isDark ? "text-white" : "text-[var(--primary-light)]"
                    }`}
                  />
                </button>

                {/* box setting */}
                {settingNot.show && settingNot.id === not.id && (
                  <div
                    className={`absolute right-5 z-120 w-50 h-auto top-9 p-1 rounded-md ${
                      isDark ? "bg-[]" : "bg-[var(--secondary-light)]"
                    }`}
                    style={{ boxShadow: "1px 2px 12px #f1b3bfff" }}
                  >
                    <span
                      className={`flex flex-row gap-2 justify-start items-center p-1 ${
                        isDark ? "hover:bg-[]" : "hover:bg-white"
                      }`}
                    >
                      <IoMdCheckmark
                        className={`${
                          isDark ? "text-[]" : "text-[var(--green-dark)]"
                        }`}
                      />
                      <h4
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-[var(--green-medium)]"
                        }`}
                      >
                        Mark as unread
                      </h4>
                    </span>
                    <span
                      className={`flex flex-row gap-2 justify-start items-center p-1 ${
                        isDark ? "hover:bg-[]" : "hover:bg-white"
                      }`}
                    >
                      <CiCircleRemove
                        className={`${
                          isDark ? "text-[]" : "text-[var(--green-dark)]"
                        }`}
                      />
                      <h4
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-[var(--green-medium)]"
                        }`}
                      >
                        Remove Notification
                      </h4>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div
        className={`flex flex-col w-full p-3 justify-center items-center w-full h-12 ${
          isDark ? "bg-[var(--secondary-light)]" : "bg-[var(--secondary-light)]"
        }`}
      >
        <button className={`${isDark ? "bg-[]" : "bg-[]"}`}>
          <MdDelete />
          <span>Clear all Notifications</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationMessages;

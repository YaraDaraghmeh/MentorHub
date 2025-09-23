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
import ConfirmModal from "../Modal/ModalConfirm";

const NotificationMessages = () => {
  const { isDark } = useTheme();
  const token = localStorage.getItem("accessToken");
  const [allNotification, setAllNotification] = useState<notification[]>([]);
  const { notificaConnection, isConnected } = useSignalRChat(
    localStorage.getItem("accessToken") || ""
  );
  const [settingNot, setSetting] = useState({
    id: 0,
    isRead: false,
    show: false,
  });
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [modalRemoveAll, setModalRemoveAll] = useState(false);

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

  const handleMarkAsRead = () => {
    setModalConfirm(true);
  };

  const handleRemoveNot = () => {
    setModalRemove(true);
  };

  return (
    <>
      <div
        className="rounded-lg overflow-hidden fixed top-14 right-16 z-50 w-[28rem] flex flex-col justify-center items-center transition-all duration-300 ease-in-out transform animate-slide-down"
        // style={{ boxShadow: "1px 2px 12px #f1b3bfff" }}
        style={{
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.5)"
            : "1px 2px 12px #f1b3bfff",
        }}
      >
        <div
          className={`w-full h-110 ${
            isDark ? "bg-[var(--primary)]" : "bg-white"
          }`}
        >
          {/* header */}
          <div
            className={`w-full flex flex-row items-center p-3 border-b-2 gap-2 ${
              isDark
                ? "border-[var(--primary-dark)] bg-[var(--primary-dark)]"
                : "border-[var(--primary-green-light)] bg-[var(--secondary-light)]"
            }`}
          >
            <h2
              className={`font-bold text-lg ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)]"
              }`}
            >
              Notifications
            </h2>
            <span
              className={`font-semibold text-md ${
                isDark
                  ? "text-[var(--System-Gray-400)]"
                  : "text-[var(--System-Gray-700)]"
              }`}
            >
              |
            </span>
            <h4
              className={`text-sm mt-1 ${
                isDark ? "text-[var(--accent)]" : "text-[var(--accent)]"
              }`}
            >
              Messages
            </h4>
          </div>

          {/* Notifications */}
          <div
            className={`flex flex-col w-full border h-full overflow-y-auto  ${
              isDark
                ? "border-[var(--primary-rgba)]"
                : "border-[var(--primary-green-light)]"
            }`}
            style={{
              scrollbarColor: "black lightgray",
              scrollbarWidth: "thin",
            }}
          >
            {allNotification.length > 0 ? (
              allNotification.map((not) => (
                <div
                  key={not.id}
                  className={`w-full flex flex-row p-3 border-b-2 justify-between min-h-20 group relative cursor-pointer ${
                    isDark
                      ? "border-[var(--primary-rgba)]"
                      : "border-[var(--primary-green-light)]"
                  }`}
                >
                  <div className="flex flex-col flex-1 justify-between">
                    <h3
                      className={`text-start text-[15px] ${
                        isDark
                          ? "text-[var(--gray-lighter)]"
                          : "text-[var(--primary-rgba)]"
                      }`}
                    >
                      {not.title}
                    </h3>
                    <h4
                      className={`text-start text-sm ${
                        isDark
                          ? "text-[var(--System-Gray-500)]"
                          : "text-[var(--accent)]"
                      }`}
                    >
                      {not.message}
                    </h4>
                  </div>
                  <span
                    className={`flex flex-col justify-center items-center gap-3 text-sm self-start ${
                      isDark
                        ? "text-[var(--secondary)]"
                        : "text-[var(--secondary-dark)]"
                    }`}
                  >
                    {FormatTime(not.createdAt)}
                    {/* is not read */}
                    {!not.isRead ? (
                      <span className="">
                        <GoDotFill
                          className={`w-5 h-5 ${
                            isDark
                              ? "text-[var(--cyan-800)]"
                              : "text-[var(--blue-medium)]"
                          }`}
                        />
                      </span>
                    ) : null}
                  </span>

                  <div className="relative">
                    {/* button setting */}
                    <button
                      className={`bg-[var(--secondary-light)] border-[var(--Philippine)] mt-5.5 p-1 transition-opacity duration-300 rounded-full border-1 h-fit 
                      
                    ${
                      settingNot.show && settingNot.id === not.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                      onClick={() => handleSetting(not.id, not.isRead)}
                    >
                      <BsThreeDotsVertical
                        className={`w-4 h-4 ${
                          isDark
                            ? "text-[var(--primary-light)]"
                            : "text-[var(--primary-light)]"
                        }`}
                      />
                    </button>

                    {/* box setting */}
                    {settingNot.show && settingNot.id === not.id && (
                      <div
                        className={`absolute right-5 z-55 w-50 h-auto top-9 p-2 rounded-md ${
                          isDark
                            ? "bg-[var(--primary-rgba)]"
                            : "bg-[var(--secondary-light)]"
                        }`}
                        style={{
                          boxShadow: isDark
                            ? "0 4px 20px rgba(0,0,0,0.5)"
                            : "1px 2px 12px #f1b3bfff",
                        }}
                      >
                        <span
                          className={`flex flex-row gap-2 justify-start items-center p-1 ${
                            isDark
                              ? "hover:bg-[var(--primary-light)]"
                              : "hover:bg-white"
                          }`}
                          onClick={handleMarkAsRead}
                        >
                          <IoMdCheckmark
                            className={`${
                              isDark
                                ? "text-[var(--secondary)]"
                                : "text-[var(--green-dark)]"
                            }`}
                          />
                          <h4
                            className={`font-medium text-sm ${
                              isDark
                                ? "text-[var(--gray-lighter)]"
                                : "text-[var(--green-medium)]"
                            }`}
                          >
                            {not.isRead === false
                              ? "Mark as read"
                              : "Mark as unread"}
                          </h4>
                        </span>
                        <span
                          className={`flex flex-row gap-2 justify-start items-center p-1 ${
                            isDark
                              ? "hover:bg-[var(--primary-light)]"
                              : "hover:bg-white"
                          }`}
                          onClick={handleRemoveNot}
                        >
                          <CiCircleRemove
                            className={`${
                              isDark
                                ? "text-[var(--secondary)]"
                                : "text-[var(--green-dark)]"
                            }`}
                          />
                          <h4
                            className={`font-medium text-sm ${
                              isDark
                                ? "text-[var(--gray-lighter)]"
                                : "text-[var(--green-medium)]"
                            }`}
                          >
                            Remove Notification
                          </h4>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`flex flex-1 justify-center items-center ${
                  isDark ? "text-white" : "text-[var(--primary)]"
                }`}
              >
                No Notifications
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div
          className={`z-50 flex flex-col w-full p-3 justify-center items-center h-12 ${
            isDark ? "bg-[var(--primary-dark)]" : "bg-[var(--secondary-light)]"
          }`}
        >
          <button
            className={`flex flex-row justify-center items-center gap-2 
              ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)]"
              }`}
            onClick={() => {
              setModalRemoveAll(true);
            }}
          >
            <MdDelete />
            <span className="text-sm">Clear all Notifications</span>
          </button>
        </div>
      </div>

      {/* Modal Confirm Mark as read */}
      <ConfirmModal
        open={modalConfirm}
        title="Mark as Read"
        message="Do you want to mark this notification as read?"
        onClose={() => setModalConfirm(false)}
        onConfirm={async () => {
          try {
            const resp = await axios.patch(
              `${urlNotification.NOTIFICATION}/${settingNot.id}/mark-as-read`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(resp.data);
            setModalConfirm(false);
            setAllNotification((prev) =>
              prev.map((not) =>
                not.id === settingNot.id
                  ? {
                      ...not,
                      isRead: true,
                    }
                  : not
              )
            );
          } catch (error: any) {
            console.log("Mark as read error: ", error);
          }
        }}
      />

      {/* Modal Confirm remove notification */}
      <ConfirmModal
        open={modalRemove}
        title="Remove Notification"
        message="Do you want to remove this notification?"
        onClose={() => setModalRemove(false)}
        onConfirm={async () => {
          try {
            const resp = await axios.delete(
              `${urlNotification.NOTIFICATION}/${settingNot.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(resp.data);
            setModalRemove(false);

            setAllNotification((prev) =>
              prev.filter((not) => not.id !== settingNot.id)
            );
          } catch (error: any) {
            console.log("Mark as read error: ", error);
          }
        }}
      />

      {/* Modal Confirm remove notification */}
      <ConfirmModal
        open={modalRemoveAll}
        title="Remove All Notification"
        message="Do you want to remove notifications?"
        onClose={() => setModalRemoveAll(false)}
        onConfirm={async () => {
          try {
            const resp = await axios.delete(
              `${urlNotification.DELETE_ALL_NOTIFICATIONS}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(resp.data);
            setModalRemoveAll(false);

            setAllNotification([]);
          } catch (error: any) {
            console.log("Mark as read error: ", error);
          }
        }}
      />
    </>
  );
};

export default NotificationMessages;

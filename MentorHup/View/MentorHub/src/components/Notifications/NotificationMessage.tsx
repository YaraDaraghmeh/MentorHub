import axios from "axios";
import { useEffect, useState } from "react";
import urlNotification from "../../Utilities/Chatting/urlNotification";

interface notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  title: string;
}

const NotificationMessages = () => {
  const [allNotification, setAllNotification] = useState<notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getAllNotifications = async () => {
      try {
        const res = await axios.get(urlNotification.NOTIFICATION, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
      } catch (error: any) {
        console.log("Notification error: ", error);
      }
    };

    getAllNotifications();
  }, []);

  return <div></div>;
};

export default NotificationMessages;

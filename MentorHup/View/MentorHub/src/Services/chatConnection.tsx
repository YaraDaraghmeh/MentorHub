import * as signalR from "@microsoft/signalr";
import { useEffect, useState, useCallback } from "react";
import type { message, notification } from "../components/Tables/interfaces";

export const useSignalRChat = (token: string) => {
  const [chatConnection, setChatConnction] =
    useState<signalR.HubConnection | null>(null);
  const [notificaConnection, setNotificationConnction] =
    useState<signalR.HubConnection | null>(null);

  const [messages, setMessages] = useState<message[]>([]);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // -------------------- Connctions -----------------
  useEffect(() => {
    const chatconn = new signalR.HubConnectionBuilder()
      .withUrl("https://mentor-hub.runasp.net/chatHub", {
        accessTokenFactory: () => token,
      })
      .build();

    const notifConn = new signalR.HubConnectionBuilder()
      .withUrl("https://mentor-hub.runasp.net/notificationHub", {
        accessTokenFactory: () => token,
      })
      .build();

    setChatConnction(chatconn);
    setNotificationConnction(notifConn);

    const startConnctions = async () => {
      try {
        await chatconn.start();
        await notifConn.start();

        setIsConnected(true);
        console.log("SignalR connections established!");
      } catch (error: any) {
        console.log("SignalR connection failed, retrying...", error);
        setTimeout(startConnctions, 5000);
      }
    };

    startConnctions();

    return () => {
      chatconn.stop();
      notifConn.stop();
    };
  }, [token]);

  // ------- chat handlers ------------
  useEffect(() => {
    if (!chatConnection) return;
    if (chatConnection.state !== "Connected") return;

    const handleReceiveMessage = (message: message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleMessageRead = (messageId: number) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
      );
    };

    chatConnection.on("ReceiveMessage", handleReceiveMessage);
    chatConnection.on("MessageRead", handleMessageRead);

    return () => {
      chatConnection.off("ReceiveMessage", handleReceiveMessage);
      chatConnection.off("MessageRead", handleMessageRead);
    };
  }, [chatConnection]);

  // ------------------ notification handlers ----------------
  useEffect(() => {
    if (!notificaConnection) return;
    if (notificaConnection.state !== "Connected") return;

    const handleReceiveNotification = (notify: notification) => {
      setNotifications((prev) => [...prev, notify]);
    };

    notificaConnection.on("ReceiveNotification", handleReceiveNotification);

    return () => {
      notificaConnection.off("ReceiveNotification", handleReceiveNotification);
    };
  }, [notificaConnection]);

  // ------------ send messages ------------------------
  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (chatConnection && chatConnection.state === "Connected") {
        try {
          await chatConnection.invoke("SendMessage", receiverId, content);
        } catch (err: any) {
          console.log("Send message error:", err);
        }
      } else {
        console.warn("Connection not ready yet.");
      }
    },
    [chatConnection]
  );

  // --------------------------- mark message as read -------------
  const markMessageAsRead = useCallback(
    async (messageId: number) => {
      if (chatConnection && chatConnection.state === "Connected") {
        try {
          await chatConnection.invoke("MarkMessageAsRead", messageId);
        } catch (err) {
          console.error("Mark message as read error:", err);
        }
      }
    },
    [chatConnection]
  );

  return {
    chatConnection,
    notificaConnection,
    messages,
    notifications,
    isConnected,
    sendMessage,
    markMessageAsRead,
  };
};

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SOCKET_URL = import.meta.env.VITE_NEST_SOCKET_URL || "https://week5-day3-backend.onrender.com";

export const useSocket = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket.io connected successfully!");
    });

    newSocket.on("connect_error", (error) => {
      console.log("❌ Socket.io connection error:", error.message);
    });

    if (user) {
      newSocket.emit("join", user._id);
    }

    newSocket.on("notification", (data) => {
      console.log("New Notification:", data);
      setNotifications((prev) => [data, ...prev]);
      
      // Show dynamic toast based on type
      if (data.type === "BROADCAST") {
        toast.success(`📢 ${data.message}`, { duration: 5000 });
      } else if (data.type === "DIRECT") {
        toast.success(`💬 ${data.message}`, { duration: 5000 });
      } else if (data.type === "LIKE") {
        toast.success(`❤️ ${data.message}`, { duration: 3000 });
      }
    });

    return () => newSocket.close();
  }, [user]);

  return { socket, notifications };
};

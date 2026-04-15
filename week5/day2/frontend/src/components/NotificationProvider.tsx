"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { initiateSocket, disconnectSocket } from "@/lib/socket";

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (token) {
      const socket = initiateSocket(token);

      socket.on("notification", (notif) => {
        addNotification(notif);
        // Play sound or show toast here
      });

      return () => {
        socket.off("notification");
        disconnectSocket();
      };
    }
  }, [token, addNotification]);

  return <>{children}</>;
}

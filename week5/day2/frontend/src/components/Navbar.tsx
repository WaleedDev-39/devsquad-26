"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Bell, User, LogOut, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const { unreadCount, notifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="glass-card" style={{ margin: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "1rem", zIndex: 100 }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>
        DevSocial
      </Link>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {user ? (
          <>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="badge" style={{ position: "absolute", top: "-5px", right: "-5px", padding: "2px 6px", fontSize: "0.65rem" }}>
                  {unreadCount}
                </span>
              )}
            </div>

            <Link href={`/profile/${user.username}`}>
              <User size={24} />
            </Link>

            <button onClick={clearAuth} className="btn btn-outline" style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.5rem 1rem" }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>

      {showNotifications && (
        <div className="glass-card animate-fade-in" style={{ position: "absolute", top: "110%", right: "1rem", width: "300px", maxHeight: "400px", overflowY: "auto", padding: "1rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Notifications</h3>
          {notifications.length === 0 ? (
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>No notifications yet</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "start" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: notif.read ? "transparent" : "var(--primary)", marginTop: "6px" }} />
                <div>
                  <p style={{ fontSize: "0.85rem" }}>
                    <span style={{ fontWeight: "bold" }}>{notif.sender.username}</span> {notif.type === 'FOLLOW' ? 'followed you' : notif.type === 'POST_COMMENT' ? 'commented on your post' : notif.type === 'COMMENT_REPLY' ? 'replied to your comment' : 'liked your contribution'}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
}

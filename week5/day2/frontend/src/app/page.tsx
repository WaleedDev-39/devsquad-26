"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PostCard, { Post } from "@/components/PostCard";
import { initiateSocket, getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, token } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPosts();

    if (token) {
      const socket = initiateSocket(token);
      
      socket.on("notification", (notif) => {
        addNotification(notif);
      });

      socket.on("new-comment", (comment) => {
        // Optimistically update post count
        setPosts((prev) =>
          prev.map((p) =>
            p._id === comment.postId
              ? { ...p, commentCount: p.commentCount + 1 }
              : p
          )
        );
      });

      return () => {
        socket.off("notification");
        socket.off("new-comment");
      };
    }
  }, [token, addNotification]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        const post = await res.json();
        setPosts([post, ...posts]);
        setNewPost({ title: "", content: "" });
        setShowCreatePost(false);
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem" }}>Feed</h1>
          {user && (
            <button 
              onClick={() => setShowCreatePost(!showCreatePost)} 
              className="btn btn-primary" 
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <PlusCircle size={20} /> Create Post
            </button>
          )}
        </div>

        {showCreatePost && (
          <div className="glass-card animate-fade-in" style={{ marginBottom: "2rem" }}>
            <form onSubmit={handleCreatePost}>
              <input 
                className="input" 
                placeholder="Post Title" 
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                style={{ marginBottom: "1rem" }}
              />
              <textarea 
                className="input" 
                placeholder="What's on your mind?" 
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                style={{ marginBottom: "1rem", resize: "none" }}
              />
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowCreatePost(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Post</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-dim)", marginTop: "4rem" }}>No posts yet. Be the first to share something!</p>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onLike={(id) => {
                  fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts/${id}/like`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` }
                  });
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard, { Post } from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";
import { Comment } from "@/components/CommentItem";
import { useAuthStore } from "@/store/authStore";
import { initiateSocket } from "@/lib/socket";
import { useNotificationStore } from "@/store/notificationStore";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { token } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    fetchPost();
    fetchComments();

    if (token) {
      const socket = initiateSocket(token);
      socket.on("notification", (notif) => {
        addNotification(notif);
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [id, token, addNotification]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/comments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handleCommentLike = async (commentId: string) => {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/comments/${commentId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  if (!post) return (
    <div>
      <Navbar />
      <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
        <p>Loading post...</p>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <PostCard post={post} onLike={handleLike} />
        
        <CommentSection 
          postId={post._id} 
          comments={comments} 
          onCommentAdded={(newComment) => setComments([...comments, newComment])}
          onLike={handleCommentLike}
        />
      </div>
    </div>
  );
}

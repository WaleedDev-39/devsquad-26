"use client";

import { Share2, MessageCircle, Heart, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import Link from "next/link";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePic?: string;
  };
  likes: string[];
  commentCount: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(
    user ? post.likes.includes(user.id) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!user) return;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post._id);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
            {post.author.username[0].toUpperCase()}
          </div>
          <div>
            <Link href={`/profile/${post.author.username}`} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {post.author.username}
            </Link>
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{post.title}</h2>
      <p style={{ color: "var(--text-dim)", marginBottom: "1.5rem", fontSize: "1rem", whiteSpace: "pre-wrap" }}>
        {post.content}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <button 
            onClick={handleLike}
            style={{ display: "flex", gap: "0.4rem", alignItems: "center", color: isLiked ? "var(--primary)" : "var(--text-dim)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}
          >
            <Heart size={20} fill={isLiked ? "var(--primary)" : "none"} stroke={isLiked ? "var(--primary)" : "currentColor"} />
            {likeCount}
          </button>

          <Link 
            href={`/post/${post._id}`}
            style={{ display: "flex", gap: "0.4rem", alignItems: "center", color: "var(--text-dim)", fontSize: "0.9rem" }}
          >
            <MessageCircle size={20} />
            {post.commentCount}
          </Link>
        </div>

        <button style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}>
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}

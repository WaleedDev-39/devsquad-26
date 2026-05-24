"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Heart, Reply, MessageSquare } from "lucide-react";
import Link from "next/link";

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePic?: string;
  };
  postId: string;
  parentId: string | null;
  likes: string[];
  createdAt: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (parentId: string, content: string) => void;
  depth?: number;
}

export default function CommentItem({ comment, onLike, onReply, depth = 0 }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(user ? comment.likes.includes(user.id) : false);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = () => {
    if (!user) return;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(comment._id);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(comment._id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
  };

  return (
    <div 
      className="animate-fade-in" 
      style={{ 
        marginLeft: depth > 0 ? "1.5rem" : "0",
        marginTop: "1rem",
        borderLeft: depth > 0 ? "2px solid var(--border)" : "none",
        paddingLeft: depth > 0 ? "1rem" : "0"
      }}
    >
      <div className="glass-card" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.7rem", color: "white" }}>
            {comment.author.username[0].toUpperCase()}
          </div>
          <Link href={`/profile/${comment.author.username}`} style={{ fontWeight: "600", fontSize: "0.85rem" }}>
            {comment.author.username}
          </Link>
          <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p style={{ fontSize: "0.95rem", marginBottom: "0.75rem", whiteSpace: "pre-wrap" }}>{comment.content}</p>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button 
            onClick={handleLike}
            style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: isLiked ? "var(--primary)" : "var(--text-dim)", fontSize: "0.8rem" }}
          >
            <Heart size={14} fill={isLiked ? "var(--primary)" : "none"} stroke={isLiked ? "var(--primary)" : "currentColor"} />
            {likeCount}
          </button>

          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: "0.8rem" }}
          >
            <Reply size={14} />
            Reply
          </button>
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <input 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="input" 
              placeholder="Write a reply..." 
              style={{ fontSize: "0.85rem" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Post</button>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              onLike={onLike} 
              onReply={onReply} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import CommentItem, { Comment } from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
  onLike: (id: string) => void;
}

export default function CommentSection({ postId, comments, onCommentAdded, onLike }: CommentSectionProps) {
  const { user, token } = useAuthStore();
  const [content, setContent] = useState("");

  // Build the comment tree
  const buildTree = (flatComments: Comment[]) => {
    const map = new Map<string, Comment>();
    const tree: Comment[] = [];

    flatComments.forEach(c => map.set(c._id, { ...c, replies: [] }));

    map.forEach(c => {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.replies?.push(c);
        } else {
          // If parent not found, treat as top-level (fallback)
          tree.push(c);
        }
      } else {
        tree.push(c);
      }
    });

    return tree;
  };

  const commentTree = buildTree(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || !token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, postId }),
      });

      if (res.ok) {
        const newComment = await res.json();
        onCommentAdded(newComment);
        setContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (parentId: string, replyContent: string) => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: replyContent, postId, parentId }),
      });

      if (res.ok) {
        const newComment = await res.json();
        onCommentAdded(newComment);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "start" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input"
              placeholder="Add a comment..."
              rows={2}
              style={{ padding: "1rem", resize: "none" }}
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>Post Comment</button>
          </div>
        </form>
      ) : (
        <div className="glass-card" style={{ marginBottom: "2rem", textAlign: "center", padding: "1.5rem" }}>
          <p style={{ color: "var(--text-dim)" }}>Please sign in to join the conversation.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {commentTree.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onLike={onLike}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
}

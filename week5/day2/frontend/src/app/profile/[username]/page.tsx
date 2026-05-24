"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import PostCard, { Post } from "@/components/PostCard";
import { User as UserIcon, Mail, Users } from "lucide-react";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  followers: any[];
  following: any[];
}

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, token } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [username, user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (user) {
          const loggedInUserId = user.id || (user as any)._id;
          if (loggedInUserId) {
            const isFollower = data.followers.some((f: any) => {
              const fid = f._id || f.id || (typeof f === 'string' ? f : null);
              return fid && String(fid) === String(loggedInUserId);
            });
            setIsFollowing(!!isFollower);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserPosts = async () => {
    // This could be a filtered endpoint in a real app
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/posts`);
    if (res.ok) {
      const allPosts = await res.json();
      setPosts(allPosts.filter((p: any) => p.author.username === username));
    }
  };

  const handleFollow = async () => {
    if (!token || !profile) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com'}/users/follow/${profile._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
        await fetchProfile(); // Refresh follower count
      }
    } catch (err) {
       console.error(err);
    }
  };

  if (!profile) return (
    <div>
      <Navbar />
      <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
        <p>Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="glass-card animate-fade-in" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem", color: "white" }}>
              {profile.username[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ fontSize: "2rem" }}>{profile.username}</h1>
                {user && user.username !== username && (
                  <button onClick={handleFollow} className={isFollowing ? "btn btn-outline" : "btn btn-primary"}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
              <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dim)", margin: "0.5rem 0" }}>
                <Mail size={16} /> {profile.email}
              </p>
              <p style={{ margin: "1rem 0" }}>{profile.bio || "No bio yet."}</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Users size={16} /> <strong>{profile.followers.length}</strong> Followers
                </span>
                <span><strong>{profile.following.length}</strong> Following</span>
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: "1.5rem" }}>Posts</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {posts.length === 0 ? (
            <p style={{ color: "var(--text-dim)" }}>No posts yet.</p>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} onLike={() => {}} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import API from "../../api";
import { Users, Film, Tv, Star, Ban, CreditCard } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: Users,
          color: "#3B82F6",
          bg: "rgba(59,130,246,0.1)",
        },
        {
          label: "Total Movies",
          value: stats.totalMovies,
          icon: Film,
          color: "#E50000",
          bg: "rgba(229,0,0,0.1)",
        },
        {
          label: "Total Shows",
          value: stats.totalShows,
          icon: Tv,
          color: "#8B5CF6",
          bg: "rgba(139,92,246,0.1)",
        },
        {
          label: "Total Reviews",
          value: stats.totalReviews,
          icon: Star,
          color: "#F59E0B",
          bg: "rgba(245,158,11,0.1)",
        },
        {
          label: "Blocked Users",
          value: stats.blockedUsers,
          icon: Ban,
          color: "#EF4444",
          bg: "rgba(239,68,68,0.1)",
        },
        {
          label: "Active Subscriptions",
          value: stats.activeSubscriptions,
          icon: CreditCard,
          color: "#10B981",
          bg: "rgba(16,185,129,0.1)",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Dashboard</h1>
        <p className="text-[#999] text-[14px] mt-1">
          Overview of your StreamVibe platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 hover:border-[#333] transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#999] text-[13px] mb-2">{card.label}</p>
                <p className="text-white text-[36px] font-bold leading-none">
                  {card.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon size={22} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

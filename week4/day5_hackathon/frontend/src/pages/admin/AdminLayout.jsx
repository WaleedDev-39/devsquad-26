import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Film,
  CreditCard,
  ArrowLeft,
  Shield,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const sidebarLinks = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/movies", icon: Film, label: "Movies & Shows" },
    { path: "/admin/plans", icon: CreditCard, label: "Plans" },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[260px] bg-[#1A1A1A] border-r border-[#262626] flex-col fixed h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#262626]">
          <div className="flex items-center gap-2 text-[#E50000]">
            <Shield size={24} />
            <span className="text-[20px] font-bold text-white">Admin Panel</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition-all ${
                  isActive
                    ? "bg-[#E50000]/15 text-[#E50000] font-medium border border-[#E50000]/20"
                    : "text-[#999] hover:text-white hover:bg-[#262626]/50"
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Back to Site */}
        <div className="p-4 border-t border-[#262626]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#999] hover:text-white px-4 py-3 rounded-lg transition-all w-full text-[14px] hover:bg-[#262626]/50"
          >
            <ArrowLeft size={16} />
            Back to StreamVibe
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar for Admin */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-[#262626] z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#E50000]">
            <Shield size={20} />
            <span className="text-[16px] font-bold text-white">Admin</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-[#999] hover:text-white text-[13px] flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
        {/* Mobile Nav */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#E50000]/15 text-[#E50000] font-medium"
                    : "text-[#999] bg-[#262626]/50"
                }`
              }
            >
              <link.icon size={14} />
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] p-6 lg:p-8 mt-[100px] lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

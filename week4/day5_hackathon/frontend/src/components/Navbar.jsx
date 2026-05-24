import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Search, Menu, X, LogOut, Shield, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "Movies & Shows" },
    { path: "/support", label: "Support" },
    { path: "/subscriptions", label: "Subscriptions" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#141414]/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center lg:mx-20 mx-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/Logo.png" alt="StreamVibe" className="h-8 lg:h-10" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex gap-1 items-center text-[#BFBFBF] text-[16px] px-4 py-2 bg-[#0F0F0F]/80 rounded-xl border border-[#1F1F1F]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-3 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-[#1A1A1A] text-white font-medium"
                    : "hover:text-white hover:bg-[#1A1A1A]/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <Search
              className="text-[#BFBFBF] hover:text-white cursor-pointer transition-colors"
              size={20}
            />
            <Bell
              className="text-[#BFBFBF] hover:text-white cursor-pointer transition-colors"
              size={20}
            />

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 bg-[#E50000]/20 border border-[#E50000]/40 text-[#E50000] px-3 py-2 rounded-lg text-[13px] font-medium hover:bg-[#E50000]/30 transition-all"
                  >
                    <Shield size={14} />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] rounded-lg px-3 py-2">
                  <div className="w-7 h-7 bg-[#E50000] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-white text-[14px] max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[#999] hover:text-[#E50000] transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="text-[#BFBFBF] hover:text-white px-4 py-2 rounded-lg text-[14px] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#E50000] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[14px] font-medium transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[280px] bg-[#1A1A1A] border-l border-[#262626] z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#262626]">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src="/Logo.png" alt="StreamVibe" className="h-7" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile User Info */}
        {isAuthenticated && (
          <div className="p-5 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E50000] rounded-full flex items-center justify-center text-white text-[16px] font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-[15px]">{user?.name}</p>
                <p className="text-[#999] text-[12px]">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Nav Links */}
        <div className="p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-[15px] transition-all ${
                isActive(link.path)
                  ? "bg-[#262626] text-white font-medium"
                  : "text-[#999] hover:text-white hover:bg-[#262626]/50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-[15px] text-[#E50000] hover:bg-[#E50000]/10 transition-all"
            >
              <Shield size={16} />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Mobile Auth */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-[#262626]">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#262626] hover:bg-[#333] text-white py-3 rounded-lg text-[14px] transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#262626] hover:bg-[#333] text-white py-3 rounded-lg text-[14px] transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#E50000] hover:bg-red-700 text-white py-3 rounded-lg text-[14px] font-medium transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

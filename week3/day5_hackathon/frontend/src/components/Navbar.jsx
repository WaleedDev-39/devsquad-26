import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ onCartOpen, cartCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "TEA COLLECTIONS", path: "/collections" },
    { label: "ACCESSORIES", path: "/accessories" },
    { label: "BLOG", path: "/blog" },
    { label: "CONTACT US", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="./brand_logo.png" alt="" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold tracking-widest no-underline transition-colors pb-1 border-b-2 ${
                    isActive ? "text-gray-900 border-gray-900" : "text-gray-500 border-transparent hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FiSearch size={18} />
            </button>

            {user ? (
              <div className="relative group">
                <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <FiUser size={18} />
                </button>
                <div className="invisible group-hover:visible absolute right-0 top-full bg-white shadow-lg rounded-lg py-2 min-w-[180px] border border-gray-100 z-50">
                  <p className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">{user.name}</p>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">My Orders</Link>
                  {isAdmin && (
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); navigate("/"); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <FiUser size={18} />
              </Link>
            )}

            <button onClick={onCartOpen} className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700">
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-semibold tracking-widest no-underline border-b border-gray-50 ${
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {!user && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-gray-500 hover:text-gray-900 no-underline">
              LOGIN / SIGNUP
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

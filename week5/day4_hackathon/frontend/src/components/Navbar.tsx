'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Bell, Car as CarIcon, ChevronDown, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Car Auction', path: '/auctions' },
    { name: 'Sell Your Car', path: '/sell' },
    { name: 'About us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <nav className="bg-background py-4 px-4 shadow-sm relative z-50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Car Deposit Logo" width={150} height={40} className="object-contain" />
        </Link>

        <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`hover:text-primary transition-colors relative ${
                  isActive ? 'text-primary font-semibold' : ''
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-primary rounded" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-6 text-primary">
          {!isAuthenticated ? (
            <div className="flex space-x-4 items-center">
              <Link href="/auth/login" className="font-semibold hover:text-secondary transition-colors">
                Sign in
              </Link>
              <span className="text-gray-400">or</span>
              <Link href="/auth/register" className="btn-primary py-1.5 px-4 text-sm font-semibold">
                Register now
              </Link>
            </div>
          ) : (
            <>
              <Link href="/profile?tab=wishlist" className="hover:text-secondary transition-colors cursor-pointer">
                <Star size={20} />
              </Link>
              <div className="relative cursor-pointer hover:text-secondary transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="relative">
                <button
                  className="flex items-center space-x-1 hover:text-secondary transition-colors focus:outline-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <CarIcon size={20} />
                  <ChevronDown size={14} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={16} className="mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

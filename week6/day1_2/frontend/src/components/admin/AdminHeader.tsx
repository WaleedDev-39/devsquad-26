'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, LogOut, Key, User, X } from 'lucide-react';
import Link from 'next/link';
import { connectSocket, getSocket } from '@/lib/socket';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function AdminHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to socket for admin notifications
    const socket = connectSocket();

    socket.on('sale-started', (data: any) => {
      setNotifications(prev => [data, ...prev].slice(0, 10));
      toast.success(data.message, { icon: '🔥', duration: 5000 });
    });

    socket.on('joined', (msg) => console.log('Socket Joined:', msg));

    return () => {
      socket.off('sale-started');
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <header className="h-[90px] bg-white border-b border-gray-200 flex items-center justify-end px-8 z-50 sticky top-0">
      <div className="flex items-center gap-6 relative">
        
        {/* Search Toggle/Input */}
        <div className="flex items-center" ref={searchRef}>
          {showSearch ? (
            <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden w-64 animate-in fade-in slide-in-from-right-4">
              <input 
                type="text" 
                autoFocus
                placeholder="Search products..." 
                className="bg-transparent px-4 py-2 text-sm focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-2 hover:bg-gray-100 text-gray-500">
                <Search size={18} />
              </button>
              <button type="button" onClick={() => setShowSearch(false)} className="p-2 border-l border-gray-200 text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <Search size={22} />
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-600 hover:text-black transition-colors relative"
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border border-white font-bold animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
               <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-sm">Notifications</h3>
                 <button onClick={() => setNotifications([])} className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase transition-colors">Clear All</button>
               </div>
               <div className="max-h-96 overflow-y-auto">
                 {notifications.length === 0 ? (
                   <div className="p-10 text-center text-gray-400 text-sm">No new notifications</div>
                 ) : (
                   notifications.map((n, i) => (
                     <div key={i} className="px-4 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0 group">
                        <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-semibold uppercase">{new Date(n.timestamp).toLocaleTimeString()}</p>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="relative group">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold hover:border-gray-400 transition-colors bg-white">
            <User size={16} className="text-gray-400"/>
            ADMIN 
            <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all animate-in fade-in slide-in-from-top-2">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Controls</div>
              <Link href="/admin/settings" className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-between group/item">
                <span className="flex items-center gap-2 font-bold"><Key size={16} className="text-gray-400"/> CHANGE PASSWORD</span>
                <span className="text-xs text-gray-300 group-hover/item:text-black transition-colors">›</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between group/item transition-colors"
              >
                <span className="flex items-center gap-2 font-bold"><LogOut size={16}/> LOG OUT</span>
                <span className="text-xs text-red-100 group-hover/item:text-red-400 transition-colors">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

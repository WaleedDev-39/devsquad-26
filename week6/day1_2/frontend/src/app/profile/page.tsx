'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, Star, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.66-3.84-1.29-4.08-1.965-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.68 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.006 14.006 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 01-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.085 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.085 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" fill="#5865F2"/>
  </svg>
);
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/login');
  }, [isLoggedIn, router]);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
    enabled: isLoggedIn,
  });
  const orders: Order[] = ordersData?.data || [];

  if (!isLoggedIn || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-integral font-black text-3xl mb-8">MY ACCOUNT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-gray-200 rounded-2xl p-6 text-center">
            <div className="relative inline-block mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {user.provider && user.provider !== 'local' && (
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
                  {user.provider === 'google' && <GoogleIcon size={14} />}
                  {user.provider === 'github' && <GithubIcon size={14} />}
                  {user.provider === 'discord' && <DiscordIcon size={14} />}
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg">{user.name || 'User'}</h2>
            <p className="text-gray-400 text-sm mt-1">{user.email || 'No email'}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded uppercase tracking-wider">{user.role || 'user'}</span>
              {user.provider && (
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  via {user.provider}
                </span>
              )}
            </div>
          </div>

          {/* Loyalty points */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <p className="font-bold text-sm">Loyalty Points</p>
            </div>
            <p className="font-integral text-3xl font-black text-yellow-600">{(user.loyaltyPoints || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Worth {formatPrice(Math.floor((user.loyaltyPoints || 0) * 0.01))} • 1 point = ₹0.01
            </p>
            <p className="text-xs text-gray-400 mt-1">Earn 1 point per ₹1 spent</p>
          </div>

          {/* Quick links */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            {[
              { icon: Package, label: 'My Orders', href: '#orders' },
              { icon: UserIcon, label: 'Edit Profile', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-gray-500" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors text-red-500">
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Order history */}
        <div className="lg:col-span-2" id="orders">
          <h2 className="font-bold text-xl mb-4">Order History</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-2xl p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-gray-200 rounded-2xl p-12 text-center">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-400">No orders yet</p>
              <Link href="/shop" className="mt-4 inline-block text-sm text-black underline">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order._id} href={`/orders/${order._id}`}
                  className="block border border-gray-200 rounded-2xl p-5 hover:border-gray-400 transition-colors group">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                      <p className="font-bold mt-2">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                    )}
                  </div>
                  {order.loyaltyPointsEarned > 0 && (
                    <p className="text-xs text-yellow-600 mt-2 font-medium">
                      🪙 +{order.loyaltyPointsEarned} points earned
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, Star, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';
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
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-medium bg-gray-100 px-3 py-1 rounded-full capitalize">{user.role}</span>
          </div>

          {/* Loyalty points */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <p className="font-bold text-sm">Loyalty Points</p>
            </div>
            <p className="font-integral text-3xl font-black text-yellow-600">{user.loyaltyPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Worth {formatPrice(Math.floor(user.loyaltyPoints * 0.01))} • 1 point = $0.01
            </p>
            <p className="text-xs text-gray-400 mt-1">Earn 1 point per $1 spent</p>
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

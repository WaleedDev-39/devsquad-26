'use client';
import { useEffect, useState } from 'react';
import { connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { X, Zap } from 'lucide-react';

interface SaleNotif {
  message: string;
  productName: string;
  salePercent: number;
  productId: string;
  timestamp: Date;
}

export default function SaleNotification() {
  const { user } = useAuthStore();
  const [notification, setNotification] = useState<SaleNotif | null>(null);

  useEffect(() => {
    const socket = connectSocket(user?._id);
    socket.on('sale-started', (data: SaleNotif) => {
      setNotification(data);
      setTimeout(() => setNotification(null), 8000);
    });
    return () => { socket.off('sale-started'); };
  }, [user]);

  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 sale-notification max-w-sm w-full">
      <div className="bg-black text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-yellow-400 mb-0.5">Flash Sale!</p>
          <p className="text-sm font-medium leading-snug">{notification.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

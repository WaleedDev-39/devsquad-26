'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible) return null;
  if (mounted && isLoggedIn) return null;
  return (
    <div className="announcement-bar">
      <p className="text-xs sm:text-sm ">
        Sign up and get 20% off to your first order.{' '}
        <a href="/auth/register" className="underline hover:text-gray-300 transition-colors">
          Sign Up Now
        </a>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}

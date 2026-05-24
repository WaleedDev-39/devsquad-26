'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!isLoggedIn) {
      router.push('/auth/login');
    } else if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [isLoggedIn, user, router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold font-satoshi animate-pulse">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f3f4f6] min-h-screen font-satoshi">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

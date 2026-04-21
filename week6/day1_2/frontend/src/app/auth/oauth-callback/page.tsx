'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Temporarily store token so getMe can use it
      localStorage.setItem('shopco_token', token);

      // Fetch user details
      authApi.getMe()
        .then((res) => {
          setAuth(res.data, token);
          toast.success(`Welcome back, ${res.data.name}! 👋`);
          
          // Redirect based on role
          if (res.data.role === 'admin' || res.data.role === 'superadmin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        })
        .catch((err) => {
          console.error('OAuth Error:', err);
          localStorage.removeItem('shopco_token');
          toast.error('Authentication failed. Please try again.');
          router.push('/auth/login');
        });
    } else {
      toast.error('No authentication token found.');
      router.push('/auth/login');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Finalizing your login...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading authentication...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}

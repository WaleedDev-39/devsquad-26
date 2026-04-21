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
    const error = searchParams.get('error');

    // Guard: backend redirected with an error
    if (error) {
      toast.error(`Login failed: ${error}. Please try again.`);
      router.push('/auth/login');
      return;
    }

    // Guard: token is missing or is the literal string "undefined"
    if (!token || token === 'undefined' || token === 'null') {
      console.error('OAuth callback received invalid token:', token);
      toast.error('Authentication failed: no valid token received. Please try again.');
      router.push('/auth/login');
      return;
    }

    console.log('OAuth callback: received token (first 20 chars):', token.substring(0, 20) + '...');

    // Store token so axios interceptor can use it for the /me request
    localStorage.setItem('shopco_token', token);

    // Fetch full user profile
    authApi.getMe()
      .then((res) => {
        setAuth(res.data, token);
        toast.success(`Welcome, ${res.data.name}! 🎉`);

        if (res.data.role === 'admin' || res.data.role === 'superadmin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      })
      .catch((err) => {
        console.error('OAuth Error calling /auth/me:', err.response?.status, err.response?.data);
        localStorage.removeItem('shopco_token');
        toast.error('Authentication failed. Please try again.');
        router.push('/auth/login');
      });
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

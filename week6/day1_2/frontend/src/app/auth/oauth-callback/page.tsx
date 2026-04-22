'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
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
      toast.error('Authentication failed: no valid token received.');
      router.push('/auth/login');
      return;
    }

    try {
      // Decode JWT payload directly — no network call needed!
      // JWT format: header.payload.signature (all base64url encoded)
      const base64Payload = token.split('.')[1];
      const decoded = JSON.parse(
        atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
      );

      console.log('OAuth callback: decoded JWT for user:', decoded.email);

      if (!decoded.sub || !decoded.email) {
        throw new Error('JWT payload is missing required fields');
      }

      const user = {
        _id: decoded.sub,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        role: decoded.role || 'user',
        avatar: decoded.avatar || null,
        provider: decoded.provider || 'local',
        loyaltyPoints: decoded.loyaltyPoints || 0,
      };

      // Persist token and user in auth store + localStorage
      setAuth(user as any, token);
      toast.success(`Welcome, ${user.name}! 🎉`);

      if (user.role === 'admin' || user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('OAuth callback: failed to decode JWT:', err);
      toast.error('Authentication failed. Please try again.');
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
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading authentication...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}

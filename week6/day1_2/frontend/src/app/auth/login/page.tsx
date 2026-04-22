'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 256 199" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M216.856 16.597c-14.881-6.877-30.769-11.821-47.334-14.526a1.2 1.2 0 0 0-1.263.593c-2.016 3.585-4.249 8.28-5.805 11.966-18.067-2.701-36.039-2.701-53.843 0-1.562-3.687-3.83-8.381-5.865-11.966a1.201 1.201 0 0 0-1.263-.593c-16.565 2.705-32.453 7.649-47.334 14.526-.402.18-.756.495-1.025.882-29.697 44.354-37.771 87.351-33.804 129.743a1.442 1.442 0 0 0 .548 1.012c23.013 16.918 45.344 27.209 67.33 34.01 5.399-7.357 10.264-15.15 14.522-23.23a1.196 1.196 0 0 0-.655-1.644c-7.8-2.924-15.191-6.637-22.116-11.127a1.205 1.205 0 0 1-.115-1.954c1.517-1.125 3.033-2.316 4.48-3.535a1.189 1.189 0 0 1 1.242-.16c43.14 19.98 90.065 19.98 133.208 0a1.19 1.19 0 0 1 1.258.151c1.446 1.228 2.962 2.419 4.48 3.543a1.205 1.205 0 0 1-.11 1.954c-6.93 4.49-14.321 8.203-22.121 11.127a1.196 1.196 0 0 0-.649 1.644c4.258 8.08 9.123 15.873 14.522 23.23 21.986-6.8 44.312-17.092 67.33-34.01a1.439 1.439 0 0 0 .554-1.002c4.46-49.336-7.55-91.865-33.882-129.76a1.19 1.19 0 0 0-1.012-.87zM85.474 114.636c-13.413 0-24.512-12.327-24.512-27.42 0-15.091 10.865-27.42 24.512-27.42 13.648 0 24.717 12.329 24.512 27.42 0 15.093-10.864 27.42-24.512 27.42zm85.061 0c-13.413 0-24.512-12.327-24.512-27.42 0-15.091 10.865-27.42 24.512-27.42 13.648 0 24.717 12.329 24.512 27.42 0 15.093-10.864 27.42-24.512 27.42z" fill="#5865F2"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const { mutate: login, isPending } = useMutation({
    mutationFn: () => authApi.login(form),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      
      // Redirect based on role
      if (res.data.user.role === 'admin' || res.data.user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="flex justify-center"><img src="/logo.png" alt="logo" /></span>
          <h1 className="text-2xl font-bold mt-4">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                required
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                autoComplete="current-password"
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <span className="relative px-4 bg-white text-gray-500 text-xs uppercase tracking-wider">Or continue with</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <div className="group-hover:scale-110 transition-transform">
              <GoogleIcon />
            </div>
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/github`}
            className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <div className="group-hover:scale-110 transition-transform">
              <GithubIcon />
            </div>
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/discord`}
            className="flex items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <div className="group-hover:scale-110 transition-transform">
              <DiscordIcon />
            </div>
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-black underline hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

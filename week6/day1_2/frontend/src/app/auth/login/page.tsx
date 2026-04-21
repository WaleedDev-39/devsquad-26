'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Github, Chrome, MessageSquare } from 'lucide-react';

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
            className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <Chrome className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold sm:hidden">Google</span>
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/github`}
            className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold sm:hidden">GitHub</span>
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/discord`}
            className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-sm group"
          >
            <MessageSquare className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold sm:hidden">Discord</span>
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

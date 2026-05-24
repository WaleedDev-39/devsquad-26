'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import PageBanner from '@/components/PageBanner';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const res = await api.post('/auth/login', {
          email: values.email,
          password: values.password,
        });
        
        const { user, token } = res.data;
        dispatch(setCredentials({ user, token }));
        
        // Save token to cookie
        Cookies.set('token', token, { expires: values.rememberMe ? 7 : 1 });
        
        router.push('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <PageBanner 
        title="Login" 
        subtitle="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Login' }]} 
      />

      <div className="container mx-auto max-w-2xl py-12 px-4 relative">
        {/* Toggle Button */}
        <div className="flex w-[260px] mx-auto border border-gray-300 rounded-full mb-10 overflow-hidden shadow-sm h-12 absolute -top-6 left-1/2 -translate-x-1/2 bg-white z-10">
          <Link href="/auth/register" className="flex-1 text-center flex items-center justify-center text-sm font-semibold text-[#3B4C8A] rounded-full hover:bg-gray-50 transition-colors">
            Register
          </Link>
          <div className="flex-1 text-center flex items-center justify-center text-sm font-semibold bg-[#3B4C8A] text-white rounded-full m-0.5">
            Login
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden mt-6">
          
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-bold text-center text-[#3B4C8A] mb-1">Log In</h2>
            <p className="text-center text-gray-400 mb-8 text-[13px]">
              New member? <Link href="/auth/register" className="text-[#3B4C8A] font-bold">Register Here</Link>
            </p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Enter Your Email*</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>

            <div className="relative">
              <label className="text-[11px] text-gray-500 mb-1 block">Password*</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full p-2.5 pr-10 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-[10px] text-[#3B4C8A] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={formik.handleChange}
                  checked={formik.values.rememberMe}
                  className="rounded text-primary focus:ring-primary w-3 h-3"
                />
                <span>Remember me</span>
              </label>
              
              <Link href="/auth/forgot-password" className="text-[10px] font-medium text-[#3B4C8A] underline">
                Forgot Password
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3B4C8A] text-white py-2.5 rounded text-[13px] font-semibold hover:bg-[#2A3765] transition-colors duration-300"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <span className="text-[12px] text-[#3B4C8A] font-medium">Or Register With</span>
            <div className="flex justify-center space-x-4 mt-4">
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Image src="/google.svg" alt="Google" width={18} height={18} onError={(e) => e.currentTarget.style.display = 'none'} />
              </button>
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Image src="/facebook.svg" alt="Facebook" width={18} height={18} onError={(e) => e.currentTarget.style.display = 'none'} />
              </button>
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Image src="/twitter.svg" alt="Twitter" width={18} height={18} onError={(e) => e.currentTarget.style.display = 'none'} />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

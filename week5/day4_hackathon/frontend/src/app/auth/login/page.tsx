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
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Login' }]} 
      />

      <div className="container mx-auto max-w-lg py-16 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          
          {/* Tab Switcher */}
          <div className="flex w-full bg-gray-100 p-1 rounded-lg mb-8">
            <Link href="/auth/register" className="flex-1 text-center py-2 text-sm font-medium text-gray-500 rounded-md transition-all hover:text-gray-700">
              Register
            </Link>
            <div className="flex-1 text-center py-2 text-sm font-bold bg-white text-primary rounded-md shadow-sm">
              Login
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-primary mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Please login to your account to continue</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address / Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`full-width-input w-full p-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                  formik.touched.email && formik.errors.email ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1 absolute">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`full-width-input w-full p-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                  formik.touched.password && formik.errors.password ? 'border-red-500 ring-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs mt-1 absolute">{formik.errors.password}</div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={formik.handleChange}
                  checked={formik.values.rememberMe}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Remember me</span>
              </label>
              
              <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline">
                Forget Password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-md font-bold text-lg hover:bg-primary-dark transition-colors duration-300 mt-4 shadow-md"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue Login with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button type="button" className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button type="button" className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                <svg width="18" height="18" className="mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageBanner from '@/components/PageBanner';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) return;
    setUsernameStatus('checking');
    try {
      const res = await api.get(`/auth/check-username/${username}`);
      setUsernameStatus(res.data.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('idle');
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      username: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      mobileNumber: Yup.string().required('Required'),
      username: Yup.string().min(3, 'At least 3 chars').required('Required'),
      password: Yup.string().min(6, 'At least 6 chars').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
      termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await api.post('/auth/register', {
          fullName: values.fullName,
          email: values.email,
          mobileNumber: values.mobileNumber,
          username: values.username,
          password: values.password,
        });
        
        router.push('/auth/login?registered=true');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <PageBanner 
        title="Register" 
        subtitle="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Register' }]} 
      />

      <div className="container mx-auto max-w-2xl py-12 px-4 relative">
        {/* Toggle Button */}
        <div className="flex w-[260px] mx-auto border border-gray-300 rounded-full mb-10 overflow-hidden shadow-sm h-12 absolute -top-6 left-1/2 -translate-x-1/2 bg-white z-10">
          <div className="flex-1 text-center flex items-center justify-center text-sm font-semibold bg-[#3B4C8A] text-white rounded-full m-0.5">
            Register
          </div>
          <Link href="/auth/login" className="flex-1 text-center flex items-center justify-center text-sm font-semibold text-[#3B4C8A] rounded-full hover:bg-gray-50 transition-colors">
            Login
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden mt-6">
          
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-bold text-center text-[#3B4C8A] mb-1">Register</h2>
            <p className="text-center text-gray-400 mb-8 text-[13px]">
              Do you already have an account? <Link href="/auth/login" className="text-[#3B4C8A] font-bold">Login Here</Link>
            </p>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded mb-6 text-sm font-medium border border-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-[13px] font-bold text-[#3B4C8A] inline-block border-b-2 border-[#F5A623] pb-1">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="text-[11px] text-gray-500 mb-1 block">Enter Your Full Name*</label>
                      <input
                        type="text"
                        name="fullName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                        className={`w-full p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
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
                    
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">Enter Mobile Number*</label>
                      <div className="flex border rounded overflow-hidden">
                        <select className="bg-gray-50 border-r border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none">
                          <option>India (91)</option>
                          <option>US (1)</option>
                          <option>UK (44)</option>
                        </select>
                        <input
                          type="tel"
                          name="mobileNumber"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.mobileNumber}
                          className={`w-full p-2.5 outline-none ${
                            formik.touched.mobileNumber && formik.errors.mobileNumber ? 'border-red-500' : 'border-none'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <div className="mb-4 mt-2">
                    <h3 className="text-[13px] font-bold text-[#3B4C8A] inline-block border-b-2 border-[#F5A623] pb-1">Account Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2 relative">
                      <label className="text-[11px] text-gray-500 mb-1 block">Username*</label>
                      <input
                        type="text"
                        name="username"
                        onChange={(e) => {
                          formik.handleChange(e);
                          if (e.target.value.length >= 3) {
                            setTimeout(() => checkUsername(e.target.value), 500);
                          } else {
                            setUsernameStatus('idle');
                          }
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className={`w-full p-2.5 pr-24 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button 
                        type="button" 
                        className={`absolute right-3 top-[30px] text-[10px] font-bold underline ${
                          usernameStatus === 'available' ? 'text-green-600' : 
                          usernameStatus === 'taken' ? 'text-red-600' : 'text-[#3B4C8A]'
                        }`}
                      >
                        {usernameStatus === 'idle' ? 'Check Availability' : 
                         usernameStatus === 'checking' ? 'Checking...' :
                         usernameStatus === 'available' ? 'Available ✓' : 'Taken ✗'}
                      </button>
                    </div>
                    
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">Password*</label>
                      <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`w-full p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">Confirm Password*</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className={`w-full p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Prove You Are Human */}
                <div>
                  <div className="mb-3 mt-2">
                    <h3 className="text-[13px] font-bold text-[#3B4C8A]">Prove You Are Human</h3>
                  </div>
                  <div className="border border-gray-200 rounded p-4 bg-gray-50 flex items-center mb-6">
                    <div className="w-6 h-6 border border-gray-300 bg-white rounded-sm mr-3 flex-shrink-0 cursor-pointer"></div>
                    <span className="text-[13px] font-medium text-[#3B4C8A]">I'm not a robot</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-center">
                <label className="flex items-center space-x-2 text-[10px] text-[#3B4C8A] font-medium mb-6">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    onChange={formik.handleChange}
                    checked={formik.values.termsAccepted}
                    className="rounded text-primary focus:ring-primary w-3 h-3"
                  />
                  <span>I agree to the Terms & Conditions</span>
                </label>
                
                <button
                  type="submit"
                  disabled={loading || !formik.values.termsAccepted || usernameStatus === 'taken'}
                  className="w-full bg-[#3B4C8A] text-white py-2.5 rounded text-[13px] font-semibold hover:bg-[#2A3765] transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Create Account'}
                </button>

                <div className="text-center mt-6">
                  <span className="text-[12px] text-[#3B4C8A] font-medium">Or Login With</span>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

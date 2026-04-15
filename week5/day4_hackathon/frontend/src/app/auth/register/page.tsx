'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageBanner from '@/components/PageBanner';
import api from '@/lib/api';
import Link from 'next/link';

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
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Register' }]} 
      />

      <div className="container mx-auto max-w-4xl py-16 px-4">
        <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
          
          <div className="p-8">
            {/* Tab Switcher */}
            <div className="flex w-full bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
              <div className="flex-1 text-center py-2 text-sm font-bold bg-white text-primary rounded-md shadow-sm">
                Register
              </div>
              <Link href="/auth/login" className="flex-1 text-center py-2 text-sm font-medium text-gray-500 rounded-md transition-all hover:text-gray-700">
                Login
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-center text-primary mb-2">Create New Account</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">Please fill out the form below to register</p>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded mb-6 text-sm font-medium border border-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                        className={`w-full p-3.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={`w-full p-3.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobileNumber}
                        className={`w-full p-3.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.mobileNumber && formik.errors.mobileNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
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
                        className={`w-full p-3.5 pr-24 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button 
                        type="button" 
                        className={`absolute right-2 top-2.5 text-xs font-bold px-2 py-1 rounded ${
                          usernameStatus === 'available' ? 'bg-green-100 text-green-700' : 
                          usernameStatus === 'taken' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {usernameStatus === 'idle' ? 'Check' : 
                         usernameStatus === 'checking' ? 'Checking...' :
                         usernameStatus === 'available' ? 'Available ✓' : 'Taken ✗'}
                      </button>
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`w-full p-3.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className={`w-full p-3.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                          formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <label className="flex items-start space-x-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    onChange={formik.handleChange}
                    checked={formik.values.termsAccepted}
                    className="mt-1 rounded text-primary focus:ring-primary"
                  />
                  <span>
                    I confirm that I have read, consent and agree to Car Deposit's <br className="hidden md:block" /> 
                    <a href="#" className="font-bold underline">Terms of Use</a> and <a href="#" className="font-bold underline">Privacy Policy</a>
                  </span>
                </label>
                
                <button
                  type="submit"
                  disabled={loading || !formik.values.termsAccepted || usernameStatus === 'taken'}
                  className="w-full md:w-auto bg-primary text-white py-3 px-10 rounded-md font-bold hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 min-w-[200px]"
                >
                  {loading ? 'Processing...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

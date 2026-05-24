'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/api';
import PageBanner from '@/components/PageBanner';

export default function SellCar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...filesArray].slice(0, 5)); // Limit to 5 images
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    initialValues: {
      sellerType: 'dealer',
      sellerFirstName: '',
      sellerLastName: '',
      sellerEmail: '',
      sellerPhone: '',
      
      vin: '',
      year: '',
      make: '',
      model: '',
      mileage: '',
      engineSize: '',
      color: '',
      paint: '',
      hasGccSpecs: '',
      category: 'sedan',
      accidentHistory: '',
      fullServiceHistory: '',
      isModified: 'false',
      features: '',
      description: '',
      startingBid: '',
    },
    validationSchema: Yup.object({
      sellerFirstName: Yup.string().required('First Name is required'),
      sellerLastName: Yup.string().required('Last Name is required'),
      sellerEmail: Yup.string().email('Invalid email').required('Email is required'),
      sellerPhone: Yup.string().required('Phone number is required'),
      
      vin: Yup.string().required('VIN is required'),
      year: Yup.number().required('Year is required'),
      make: Yup.string().required('Make is required'),
      model: Yup.string().required('Model is required'),
      mileage: Yup.number().required('Mileage is required'),
      startingBid: Yup.number().required('Reserve price is required'),
    }),
    onSubmit: async (values) => {
      if (photos.length === 0) {
        setError('At least one photo is required');
        return;
      }

      setLoading(true);
      setError('');

      const formData = new FormData();
      // Add all string fields
      Object.keys(values).forEach(key => {
        formData.append(key, (values as any)[key]);
      });
      // Add title
      formData.append('title', `${values.year} ${values.make} ${values.model}`);
      
      // Add files
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      try {
        await api.post('/cars', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        router.push('/profile?tab=my-cars');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit car');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <PageBanner 
        title="Sell Your Car" 
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Sell Your Car' }]} 
      />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        
        <div className="mb-10">
          <h2 className="text-[32px] font-bold text-gray-900 mb-6">Tell us about your car</h2>
          <p className="text-gray-600 text-[13px] mb-6 leading-relaxed">
            Please give us some basics about yourself and car you'd like to sell . We'll also need<br/>
            details about the car's title status as well as 50 photos that highlight the car's exterior and<br/>
            interior condition.
          </p>
          <p className="text-gray-600 text-[13px] leading-relaxed">
            We'll respond to your application within a business day, and we work with you to build a<br/>
            custom and professional listing and get the auction live.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-8 text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          
          {/* Your Info Box */}
          <div className="bg-[#EAF1FA] rounded-md p-8 mb-6">
            <div className="mb-6">
              <h3 className="text-[17px] font-bold text-gray-900 inline-block border-b-4 border-[#F5A623] pb-1">Your Info</h3>
            </div>
            
            <div className="mb-6">
              <label className="block text-[13px] text-gray-800 font-semibold mb-2">Dealer or Private party?</label>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => formik.setFieldValue('sellerType', 'dealer')}
                  className={`w-32 py-1.5 text-[13px] border rounded bg-white ${formik.values.sellerType === 'dealer' ? 'border-[#3B4C8A] text-[#3B4C8A] font-semibold' : 'border-gray-300 text-gray-600'}`}
                >
                  Dealer
                </button>
                <button 
                  type="button" 
                  onClick={() => formik.setFieldValue('sellerType', 'private')}
                  className={`w-32 py-1.5 text-[13px] border rounded bg-white ${formik.values.sellerType === 'private' ? 'border-[#3B4C8A] text-[#3B4C8A] font-semibold' : 'border-gray-300 text-gray-600'}`}
                >
                  Private party
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">First name*</label>
                <input type="text" name="sellerFirstName" onChange={formik.handleChange} value={formik.values.sellerFirstName} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A]" />
                {formik.touched.sellerFirstName && formik.errors.sellerFirstName && <p className="text-red-500 text-[10px] mt-1">{formik.errors.sellerFirstName}</p>}
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Last name*</label>
                <input type="text" name="sellerLastName" onChange={formik.handleChange} value={formik.values.sellerLastName} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A]" />
                {formik.touched.sellerLastName && formik.errors.sellerLastName && <p className="text-red-500 text-[10px] mt-1">{formik.errors.sellerLastName}</p>}
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Email*</label>
                <input type="email" name="sellerEmail" onChange={formik.handleChange} value={formik.values.sellerEmail} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A]" />
                {formik.touched.sellerEmail && formik.errors.sellerEmail && <p className="text-red-500 text-[10px] mt-1">{formik.errors.sellerEmail}</p>}
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">phone number*</label>
                <div className="flex w-full bg-white border border-gray-200 rounded overflow-hidden">
                  <div className="flex items-center px-2 bg-gray-50 border-r border-gray-200 text-[13px] text-gray-600">
                    <span className="mr-1">PK (92)</span>
                    <span className="text-[10px]">▼</span>
                  </div>
                  <input type="tel" name="sellerPhone" onChange={formik.handleChange} value={formik.values.sellerPhone} className="flex-1 px-3 py-2 text-[13px] outline-none" />
                </div>
                {formik.touched.sellerPhone && formik.errors.sellerPhone && <p className="text-red-500 text-[10px] mt-1">{formik.errors.sellerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Car Details Box */}
          <div className="bg-[#EAF1FA] rounded-md p-8">
            <div className="mb-6">
              <h3 className="text-[17px] font-bold text-gray-900 inline-block border-b-4 border-[#F5A623] pb-1">Car Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">VIN*</label>
                <input type="text" name="vin" onChange={formik.handleChange} value={formik.values.vin} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white" />
                {formik.touched.vin && formik.errors.vin && <p className="text-red-500 text-[10px] mt-1">{formik.errors.vin}</p>}
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Year*</label>
                <select name="year" onChange={formik.handleChange} value={formik.values.year} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select Year</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Make*</label>
                <select name="make" onChange={formik.handleChange} value={formik.values.make} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="BMW">BMW</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Model*</label>
                <select name="model" onChange={formik.handleChange} value={formik.values.model} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">All Models</option>
                  <option value="Camry">Camry</option>
                  <option value="Civic">Civic</option>
                  <option value="Mustang">Mustang</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Mileage (in miles)</label>
                <input type="number" name="mileage" onChange={formik.handleChange} value={formik.values.mileage} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white" />
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Engine size</label>
                <select name="engineSize" onChange={formik.handleChange} value={formik.values.engineSize} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select</option>
                  <option value="4 Cylinder">4 Cylinder</option>
                  <option value="6 Cylinder">6 Cylinder</option>
                  <option value="8 Cylinder">8 Cylinder</option>
                  <option value="10 Cylinder">10 Cylinder</option>
                  <option value="12 Cylinder">12 Cylinder</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Paint*</label>
                <select name="paint" onChange={formik.handleChange} value={formik.values.paint} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select</option>
                  <option value="Original paint">Original paint</option>
                  <option value="Partially Repainted">Partially Repainted</option>
                  <option value="Totally Repainted">Totally Repainted</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Has GCC Specs</label>
                <select name="hasGccSpecs" onChange={formik.handleChange} value={formik.values.hasGccSpecs} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] text-gray-800 font-medium mb-1">Noteworthy options/features</label>
              <textarea name="features" onChange={formik.handleChange} value={formik.values.features} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white h-28 resize-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Accident History</label>
                <select name="accidentHistory" onChange={formik.handleChange} value={formik.values.accidentHistory} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Full Service History</label>
                <select name="fullServiceHistory" onChange={formik.handleChange} value={formik.values.fullServiceHistory} className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#3B4C8A] bg-white text-[#3B4C8A] font-medium appearance-none">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-2">Has the car been modified?</label>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => formik.setFieldValue('isModified', 'false')}
                    className={`flex-1 py-1.5 text-[13px] border rounded bg-white ${formik.values.isModified === 'false' ? 'border-[#3B4C8A] text-[#3B4C8A] font-semibold' : 'border-gray-300 text-gray-600'}`}
                  >
                    Completely stock
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formik.setFieldValue('isModified', 'true')}
                    className={`flex-1 py-1.5 text-[13px] border rounded bg-white ${formik.values.isModified === 'true' ? 'border-[#3B4C8A] text-[#3B4C8A] font-semibold' : 'border-gray-300 text-gray-600'}`}
                  >
                    Modified
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[13px] text-gray-800 font-medium mb-1">Max Bid*</label>
                <div className="flex w-full bg-white border border-gray-200 rounded overflow-hidden">
                  <div className="flex items-center px-3 text-[#3B4C8A] font-bold text-[13px]">
                    $
                  </div>
                  <input type="number" name="startingBid" onChange={formik.handleChange} value={formik.values.startingBid} className="flex-1 px-2 py-2 text-[13px] outline-none text-[#3B4C8A] font-semibold" />
                </div>
                {formik.touched.startingBid && formik.errors.startingBid && <p className="text-red-500 text-[10px] mt-1">{formik.errors.startingBid}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] text-gray-800 font-medium mb-2">Upload Photos</label>
              <button 
                type="button"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-white border border-gray-300 text-[#3B4C8A] text-[13px] font-semibold py-1.5 px-6 rounded shadow-sm hover:bg-gray-50 transition-colors"
              >
                Add Photos
              </button>
              <input id="photo-upload" type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
              
              {photoPreviews.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {photoPreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden group">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removePhoto(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-32 bg-[#3B4C8A] text-white py-2 rounded text-[14px] hover:bg-[#2A3765] transition-colors font-medium shadow-sm"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}

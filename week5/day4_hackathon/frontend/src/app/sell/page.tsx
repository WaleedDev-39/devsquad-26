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
      
      agreeTerms: false,
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
      agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
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
        if (key !== 'agreeTerms') {
          formData.append(key, (values as any)[key]);
        }
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

      <div className="container mx-auto max-w-4xl px-4 py-16">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sell Your Car On <span className="text-primary italic border-b-4 border-secondary">Car Deposit</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur. Erat sit facilisis sit scelerisque nisl amet amet ut vitae. 
            Ac in amet et amet risus et pretium odio tristique.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-8 text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          <h3 className="text-xl font-bold text-primary mb-6 border-b pb-2">Your Info</h3>
          
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">You Are *</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="sellerType" 
                  value="dealer" 
                  checked={formik.values.sellerType === 'dealer'}
                  onChange={formik.handleChange}
                  className="text-primary focus:ring-primary"
                />
                <span>Dealer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="sellerType" 
                  value="private"
                  checked={formik.values.sellerType === 'private'}
                  onChange={formik.handleChange} 
                  className="text-primary focus:ring-primary"
                />
                <span>Private Party</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <input type="text" name="sellerFirstName" placeholder="First Name *" onChange={formik.handleChange} value={formik.values.sellerFirstName} className="input-field" />
              {formik.touched.sellerFirstName && formik.errors.sellerFirstName && <p className="text-red-500 text-xs mt-1">{formik.errors.sellerFirstName}</p>}
            </div>
            <div>
              <input type="text" name="sellerLastName" placeholder="Last Name *" onChange={formik.handleChange} value={formik.values.sellerLastName} className="input-field" />
              {formik.touched.sellerLastName && formik.errors.sellerLastName && <p className="text-red-500 text-xs mt-1">{formik.errors.sellerLastName}</p>}
            </div>
            <div>
              <input type="email" name="sellerEmail" placeholder="Email Address *" onChange={formik.handleChange} value={formik.values.sellerEmail} className="input-field" />
              {formik.touched.sellerEmail && formik.errors.sellerEmail && <p className="text-red-500 text-xs mt-1">{formik.errors.sellerEmail}</p>}
            </div>
            <div>
              <input type="tel" name="sellerPhone" placeholder="Mobile Number *" onChange={formik.handleChange} value={formik.values.sellerPhone} className="input-field" />
              {formik.touched.sellerPhone && formik.errors.sellerPhone && <p className="text-red-500 text-xs mt-1">{formik.errors.sellerPhone}</p>}
            </div>
          </div>


          <h3 className="text-xl font-bold text-primary mb-6 border-b pb-2">Car Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2 relative">
               {/* Custom VIN input style based on design */}
               <label className="absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-500">VIN No. *</label>
               <input type="text" name="vin" onChange={formik.handleChange} value={formik.values.vin} className="input-field border-gray-300 py-3 mt-0" />
               {formik.touched.vin && formik.errors.vin && <p className="text-red-500 text-xs mt-1">{formik.errors.vin}</p>}
            </div>

            <div>
              <input type="text" name="year" placeholder="Year *" onChange={formik.handleChange} value={formik.values.year} className="input-field" />
            </div>
            <div>
              <input type="text" name="make" placeholder="Make *" onChange={formik.handleChange} value={formik.values.make} className="input-field" />
            </div>
            <div>
              <input type="text" name="model" placeholder="Model *" onChange={formik.handleChange} value={formik.values.model} className="input-field" />
            </div>
            <div>
              <input type="number" name="mileage" placeholder="Mileage *" onChange={formik.handleChange} value={formik.values.mileage} className="input-field" />
            </div>
            
            <div>
              <input type="text" name="engineSize" placeholder="Engine Size" onChange={formik.handleChange} value={formik.values.engineSize} className="input-field" />
            </div>
            <div>
              <select name="category" onChange={formik.handleChange} value={formik.values.category} className="input-field">
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sports">Sports</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="van">Van</option>
              </select>
            </div>
            <div>
              <input type="text" name="color" placeholder="Color" onChange={formik.handleChange} value={formik.values.color} className="input-field" />
            </div>
            <div>
              <input type="text" name="paint" placeholder="Paint" onChange={formik.handleChange} value={formik.values.paint} className="input-field" />
            </div>

            <div>
              <input type="text" name="hasGccSpecs" placeholder="Has GCC specs ?" onChange={formik.handleChange} value={formik.values.hasGccSpecs} className="input-field" />
            </div>
            <div>
              <select name="isModified" onChange={formik.handleChange} value={formik.values.isModified} className="input-field">
                <option value="false">Is the car modified? No</option>
                <option value="true">Is the car modified? Yes</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <textarea name="accidentHistory" placeholder="Accident History" onChange={formik.handleChange} value={formik.values.accidentHistory} className="input-field h-24 resize-none"></textarea>
          </div>
          
          <div className="mb-6">
            <textarea name="fullServiceHistory" placeholder="Full service history" onChange={formik.handleChange} value={formik.values.fullServiceHistory} className="input-field h-24 resize-none"></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Noteworthy options/features *</label>
            <textarea name="features" onChange={formik.handleChange} value={formik.values.features} className="input-field h-24 resize-none"></textarea>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea name="description" onChange={formik.handleChange} value={formik.values.description} className="input-field h-32 resize-none"></textarea>
          </div>

          <div className="mb-8 relative max-w-sm">
            <label className="absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-500">Max Bid Reserved / Price *</label>
            <input type="number" name="startingBid" onChange={formik.handleChange} value={formik.values.startingBid} className="input-field py-3 mt-0 text-xl font-bold" />
            {formik.touched.startingBid && formik.errors.startingBid && <p className="text-red-500 text-xs mt-1">{formik.errors.startingBid}</p>}
          </div>

          <div className="mb-10">
             <label className="block text-sm font-semibold mb-2">Upload Photos *</label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('photo-upload')?.click()}
             >
                <div className="w-16 h-16 bg-[#D3E1F7] text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <p className="font-semibold text-gray-800">Drag And drop to add cover Images</p>
                <p className="text-sm text-gray-500 mt-1">Make sure have at least 5 images of car with multiple direction and closeups</p>
                <input id="photo-upload" type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
             </div>
             
             {photoPreviews.length > 0 && (
                <div className="flex gap-4 mt-4 flex-wrap">
                   {photoPreviews.map((src, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded shadow-sm overflow-hidden group">
                         <img src={src} className="w-full h-full object-cover" alt="" />
                         <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                   ))}
                </div>
             )}
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <label className="flex items-start space-x-3 text-sm text-gray-600">
               <input
                 type="checkbox"
                 name="agreeTerms"
                 onChange={formik.handleChange}
                 checked={formik.values.agreeTerms}
                 className="mt-1 rounded text-primary focus:ring-primary"
               />
               <span>
                 I agree to all Terms and Privacy policy
                 {formik.touched.agreeTerms && formik.errors.agreeTerms && <span className="text-red-500 ml-2 block">{formik.errors.agreeTerms as string}</span>}
               </span>
             </label>
             
             <button
               type="submit"
               disabled={loading}
               className="w-full md:w-auto bg-primary text-white py-3 px-12 rounded hover:bg-primary-dark transition-colors duration-300 font-medium"
             >
               {loading ? 'Submitting...' : 'Done'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}

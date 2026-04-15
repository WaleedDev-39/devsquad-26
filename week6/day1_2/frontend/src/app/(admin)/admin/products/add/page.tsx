'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, X, Tag, DollarSign, Star, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

type PurchaseType = 'money' | 'points' | 'hybrid';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    price: '',
    originalPrice: '',
    pointsPrice: '',
    earnedPoints: '',
    purchaseType: 'money' as PurchaseType,
    isOnSale: false,
    salePercent: '',
    isNewArrival: false,
    isTopSelling: false,
    tags: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createProduct(data),
    onSuccess: () => {
      toast.success('Product created successfully!');
      router.push('/admin/products');
    },
    onError: () => toast.error('Failed to create product'),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      setImages(prev => [...prev, res.data.imageUrl]);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const handleAddColor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && colorInput.trim()) {
      e.preventDefault();
      if (!formData.colors.includes(colorInput.trim())) {
        setFormData(p => ({ ...p, colors: [...p.colors, colorInput.trim()] }));
      }
      setColorInput('');
    }
  };

  const discountedPrice = formData.isOnSale && formData.price && formData.salePercent
    ? (Number(formData.price) * (1 - Number(formData.salePercent) / 100)).toFixed(2)
    : null;

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      return toast.error('Please fill all required fields: Name, Price, Category');
    }
    if (formData.purchaseType !== 'money' && !formData.pointsPrice) {
      return toast.error('Please set a Points Price for loyalty/hybrid products');
    }
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      brand: formData.brand,
      stock: Number(formData.stock) || 0,
      price: formData.isOnSale && discountedPrice ? Number(discountedPrice) : Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      purchaseType: formData.purchaseType,
      pointsPrice: formData.purchaseType !== 'money' ? Number(formData.pointsPrice) || null : null,
      earnedPoints: Number(formData.earnedPoints) || 0,
      isOnSale: formData.isOnSale,
      salePercent: formData.isOnSale ? Number(formData.salePercent) || 0 : 0,
      isNewArrival: formData.isNewArrival,
      isTopSelling: formData.isTopSelling,
      tags: formData.tags,
      colors: formData.colors,
      sizes: formData.sizes,
      images,
    });
  };

  const inputCls = 'w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003B73] focus:bg-white transition-colors';
  const labelCls = 'block text-sm font-bold text-gray-800 mb-1.5';

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-integral">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Home &gt; All Products &gt; Add New Product</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="bg-[#003B73] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#002b54] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left + Center: Main form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Basic Information</h2>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Premium Cotton T-Shirt" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Describe the product..." rows={4} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category *</label>
                <input type="text" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} placeholder="e.g. T-Shirts" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Brand</label>
                <input type="text" value={formData.brand} onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Nike" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input type="number" min="0" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} placeholder="0" className={inputCls} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-[#003B73]" /> Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Regular Price (₹) *</label>
                <input type="number" min="0" value={formData.originalPrice} onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))} placeholder="1000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Selling Price (₹) *</label>
                <input type="number" min="0" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} placeholder="850" className={inputCls} />
              </div>
            </div>

            {/* Sale */}
            <div className="p-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">%</span>
                  Put On Sale
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isOnSale}
                    onChange={e => setFormData(p => ({ ...p, isOnSale: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              {formData.isOnSale && (
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Sale Percentage (%)</label>
                    <input
                      type="number" min="0" max="100"
                      value={formData.salePercent}
                      onChange={e => setFormData(p => ({ ...p, salePercent: e.target.value }))}
                      placeholder="e.g. 20 for 20% off"
                      className={inputCls}
                    />
                  </div>
                  {discountedPrice && (
                    <div className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-100 px-4 py-2 rounded-lg">
                      <span>Discounted Price:</span>
                      <span className="text-lg">₹{discountedPrice}</span>
                      <span className="text-xs font-normal text-gray-500 ml-auto line-through">₹{formData.price}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Type / Loyalty */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
              <Zap size={16} className="text-purple-500" /> Purchase Type & Loyalty
            </h2>
            <p className="text-xs text-gray-500">Choose how customers can purchase this product.</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'money', label: 'Money Only', desc: 'Standard purchase', color: 'blue' },
                { value: 'points', label: 'Points Only', desc: 'Loyalty redemption', color: 'purple' },
                { value: 'hybrid', label: 'Hybrid', desc: 'Money OR Points', color: 'green' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, purchaseType: opt.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.purchaseType === opt.value
                      ? opt.color === 'blue'
                        ? 'border-blue-500 bg-blue-50'
                        : opt.color === 'purple'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-sm font-bold mb-0.5 ${formData.purchaseType === opt.value ? (opt.color === 'blue' ? 'text-blue-700' : opt.color === 'purple' ? 'text-purple-700' : 'text-green-700') : 'text-gray-800'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>

            {(formData.purchaseType === 'points' || formData.purchaseType === 'hybrid') && (
              <div>
                <label className={labelCls}>Points Price (loyalty points required) *</label>
                <input
                  type="number" min="0"
                  value={formData.pointsPrice}
                  onChange={e => setFormData(p => ({ ...p, pointsPrice: e.target.value }))}
                  placeholder="e.g. 500 points"
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.purchaseType === 'hybrid' ? 'Customers can pay with this many points OR with money.' : 'Customers must spend this many loyalty points to redeem this product.'}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <label className={labelCls}>Points Earned on Purchase</label>
              <input
                type="number" min="0"
                value={formData.earnedPoints}
                onChange={e => setFormData(p => ({ ...p, earnedPoints: e.target.value }))}
                placeholder="0"
                className={inputCls}
              />
              <p className="text-xs text-gray-500 mt-1">
                Specific loyalty points a user earns from this product. Leave 0 to use the default 1 point per $1 spent rule.
              </p>
            </div>
          </div>

          {/* Tags & Colors */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
              <Tag size={16} className="text-gray-400" /> Tags & Variants
            </h2>
            <div>
              <label className={labelCls}>Tags (press Enter to add)</label>
              <div className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 min-h-[80px] flex flex-wrap gap-2 content-start">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type tag + Enter..." className="flex-1 min-w-[100px] text-sm bg-transparent focus:outline-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Colors (press Enter to add)</label>
              <div className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 min-h-[60px] flex flex-wrap gap-2 content-start">
                {formData.colors.map(c => (
                  <span key={c} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    {c}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, colors: p.colors.filter(x => x !== c) }))} className="hover:text-red-300"><X size={10} /></button>
                  </span>
                ))}
                <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={handleAddColor} placeholder="e.g. Red, Blue..." className="flex-1 min-w-[100px] text-sm bg-transparent focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Images & Flags */}
        <div className="space-y-5">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 mb-4">Product Images</h2>
            {/* Preview */}
            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
              {images[0] ? (
                <Image
                  src={getImageUrl(images[0])}
                  alt="Main" fill className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400">Main image preview</p>
                </div>
              )}
            </div>

            <label className="border border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#003B73] transition-all relative mb-4">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" disabled={isUploading} />
              <Upload size={24} className={`mb-2 ${isUploading ? 'text-gray-300 animate-pulse' : 'text-[#003B73]'}`} />
              <p className="text-sm font-semibold text-gray-700">{isUploading ? 'Uploading...' : 'Click to upload'}</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP allowed</p>
            </label>

            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0 relative overflow-hidden">
                    <Image src={getImageUrl(img)} alt="thumb" fill className="object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 flex-1 truncate">Image {i + 1}</p>
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <Star size={16} className="text-yellow-500" /> Product Flags
            </h2>
            <div className="space-y-3">
              {[
                { key: 'isNewArrival', label: 'New Arrival', desc: 'Show in New Arrivals section' },
                { key: 'isTopSelling', label: 'Top Selling', desc: 'Show in Top Selling section' },
              ].map(flag => (
                <label key={flag.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{flag.label}</p>
                    <p className="text-xs text-gray-500">{flag.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={(formData as any)[flag.key]}
                      onChange={e => setFormData(p => ({ ...p, [flag.key]: e.target.checked }))}
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#003B73] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button (also at bottom of sidebar) */}
          <button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full bg-[#003B73] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#002b54] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Saving...' : '✓ Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

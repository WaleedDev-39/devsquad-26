'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { productsApi, reviewsApi } from '@/lib/api';
import { Product, Review } from '@/types';
import { formatPrice, cn, getImageUrl } from '@/lib/utils';
import StarRating from '@/components/shared/StarRating';
import SaleBadge from '@/components/shared/SaleBadge';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ProductCard from '@/components/shared/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'faq'>('reviews');

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getOne(id),
    enabled: !!id,
  });
  const product: Product = data?.data;

  const { data: relatedData } = useQuery({
    queryKey: ['related', id],
    queryFn: () => productsApi.getRelated(id),
    enabled: !!id,
  });
  const related: Product[] = relatedData?.data || [];

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getProductReviews(id),
    enabled: !!id,
  });
  const reviews: Review[] = reviewsData?.data?.reviews || [];

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size');
    if (!product) return;
    const color = selectedColor || product.colors?.[0] || '#000000';
    const size = selectedSize || product.sizes?.[0] || 'Default';
    await addItem(product, qty, size, color, isLoggedIn);
  };

  const handleBuyNow = async () => {
    if (product.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size');
    await handleAddToCart();
    router.push('/cart');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-2xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: product.category, href: `/shop?category=${product.category}` },
        { label: product.name },
      ]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px]">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 sm:w-[112px] sm:h-[112px] rounded-xl overflow-hidden border-2 transition-all',
                  activeImg === i ? 'border-black' : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image src={getImageUrl(img) || ''} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          {/* Main image */}
          <div className="relative flex-1 bg-[#F2F0F1] rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[500px]">
            <Image
              src={getImageUrl(product.images?.[activeImg] || product.images?.[0]) || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <h1 className="font-integral font-black text-2xl sm:text-3xl lg:text-4xl leading-tight">{product.name.toUpperCase()}</h1>

          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <StarRating rating={product.rating} size="sm" showValue count={product.reviewCount} />
          </div>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="font-bold text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-xl">{formatPrice(product.originalPrice)}</span>
            )}
            {product.isOnSale && product.salePercent > 0 && <SaleBadge percent={product.salePercent} />}
          </div>

          {/* Points info */}
          {(product.purchaseType === 'points' || product.purchaseType === 'hybrid') && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm">
              {product.purchaseType === 'points' && <span className="font-bold text-yellow-700">🪙 Points Only: {product.pointsPrice} points</span>}
              {product.purchaseType === 'hybrid' && <span className="font-bold text-yellow-700">🪙 Also available for {product.pointsPrice} loyalty points</span>}
            </div>
          )}

          <p className="mt-4 text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-4">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-3">Select Colors</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'w-9 h-9 rounded-full border-2 transition-all',
                      selectedColor === c ? 'border-black scale-110 shadow-md' : 'border-transparent hover:border-gray-400',
                      c === '#FFFFFF' && 'border-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-4 border-b border-gray-100 pb-4">
              <p className="text-sm font-medium mb-3">Choose Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm border transition-all',
                      selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-3 bg-[#F0F0F0] rounded-full px-4 py-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="hover:text-gray-600">
                <Minus size={16} />
              </button>
              <span className="font-medium w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="hover:text-gray-600">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="mt-2 text-xs text-orange-500 font-medium">Only {product.stock} left in stock!</p>
          )}
          {product.stock === 0 && (
            <p className="mt-2 text-xs text-red-500 font-medium">Out of stock</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-b border-gray-200">
        <div className="flex gap-6 sm:gap-10">
          {(['details', 'reviews', 'faq'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
                activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              )}
            >
              {tab === 'reviews' ? `Rating & Reviews` : tab === 'faq' ? 'FAQs' : 'Product Details'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-8">
        {activeTab === 'details' && (
          <div className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            <p>{product.description}</p>
            <ul className="mt-4 space-y-2">
              <li><strong>Brand:</strong> {product.brand}</li>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Style:</strong> {product.dressStyle}</li>
              <li><strong>Available Colors:</strong> {product.colors?.join(', ')}</li>
              <li><strong>Available Sizes:</strong> {product.sizes?.join(', ')}</li>
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="font-bold text-lg">All Reviews <span className="text-gray-400 font-normal text-base">({product.reviewCount})</span></h3>
              <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                Write a Review
              </button>
            </div>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border border-gray-100 rounded-2xl p-5">
                    <StarRating rating={review.rating} size="sm" />
                    <div className="flex items-center gap-2 mt-2 mb-2">
                      <span className="font-bold text-sm">{review.userName}</span>
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">"{review.comment}"</p>
                    <p className="text-gray-300 text-xs mt-3">
                      Posted on {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-2xl">
            {[
              { q: 'What is the return policy?', a: 'We offer a 30-day return policy for all unworn items with tags attached.' },
              { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.' },
              { q: 'How do I earn loyalty points?', a: 'You earn 1 point for every ₹1 spent. Points can be redeemed for discounts on future purchases.' },
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5">
                <p className="font-medium text-sm">{faq.q}</p>
                <p className="text-gray-500 text-sm mt-2">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-integral font-black text-2xl sm:text-3xl text-center mb-8">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

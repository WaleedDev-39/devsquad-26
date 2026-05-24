'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Breadcrumb from '@/components/shared/Breadcrumb';

export default function CartPage() {
  const { items, removeItem, updateQty, getSubtotal } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const defaultFallback = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 200 ? 0 : 15;
  const total = subtotal - discount + deliveryFee;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(Math.round(subtotal * 0.2));
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
      alert('Invalid promo code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-integral font-black text-3xl mb-3">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="inline-flex bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1 className="font-integral font-black text-3xl sm:text-4xl mt-4 mb-8">YOUR CART</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-4 sm:p-6 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#F2F0F1] rounded-xl overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image 
                    src={failedImages[item.image] ? defaultFallback : (getImageUrl(item.image) || defaultFallback)} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                    onError={() => setFailedImages(p => ({ ...p, [item.image]: true }))}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item._id, isLoggedIn)}
                    className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-1">Size: {item.size}</p>
                <p className="text-gray-400 text-xs">Color: <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, border: '1px solid #ddd', verticalAlign: 'middle' }} /></p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-base sm:text-lg">{formatPrice(item.price)}</span>
                  <div className="flex items-center gap-2 bg-[#F0F0F0] rounded-full px-3 py-1.5">
                    <button onClick={() => updateQty(item._id, item.quantity - 1, isLoggedIn)} className="hover:text-gray-600">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1, isLoggedIn)} className="hover:text-gray-600">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount (-20%)</span>
                  <span className="font-medium text-red-500">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(Math.max(0, total))}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-5 flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5">
                <Tag size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Add promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                />
              </div>
              <button
                onClick={applyPromo}
                className="px-4 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && <p className="text-green-500 text-xs mt-2">✓ Promo code applied! 20% off</p>}
            <p className="text-xs text-gray-400 mt-1">Try: <code className="bg-gray-100 px-1 rounded">SAVE20</code></p>

            <Link
              href="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

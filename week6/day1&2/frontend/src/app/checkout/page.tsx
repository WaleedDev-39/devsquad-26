'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [usePoints, setUsePoints] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 200 ? 0 : 15;
  const total = subtotal + deliveryFee;

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.createOrder({
        shippingAddress: form,
        paymentMethod,
        usePoints,
      }),
    onSuccess: (res) => {
      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/orders/${res.data._id}`);
    },
    onError: () => toast.error('Failed to place order. Please try again.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login to place an order'); router.push('/auth/login'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    placeOrder();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-integral font-black text-3xl mb-4">Your cart is empty</h1>
        <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-medium inline-block hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-integral font-black text-3xl sm:text-4xl mb-8">CHECKOUT</h1>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Left: Shipping */}
        <div className="flex-1 space-y-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-5">Shipping Information</h2>
            <div className="space-y-4">
              {[
                { id: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                { id: 'address', label: 'Address', placeholder: '123 Main St' },
                { id: 'city', label: 'City', placeholder: 'New York' },
                { id: 'postalCode', label: 'Postal Code', placeholder: '10001' },
                { id: 'country', label: 'Country', placeholder: 'United States' },
                { id: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                  <input
                    required
                    type="text"
                    placeholder={field.placeholder}
                    value={(form as any)[field.id]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-5">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'card', label: '💳 Credit / Debit Card' },
                { value: 'paypal', label: '🟡 PayPal' },
                { value: 'cash', label: '💵 Cash on Delivery' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-400 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Loyalty points */}
            {isLoggedIn && user && user.loyaltyPoints > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm font-medium">
                    🪙 Use my {user.loyaltyPoints} loyalty points (Save ${(user.loyaltyPoints * 0.01).toFixed(2)})
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-96">
          <div className="border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 line-clamp-1 flex-1">{item.name} x{item.quantity}</span>
                  <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="mt-6 w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure checkout powered by SHOP.CO</p>
          </div>
        </div>
      </form>
    </div>
  );
}

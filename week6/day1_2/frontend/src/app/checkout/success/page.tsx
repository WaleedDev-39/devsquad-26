'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();

  useEffect(() => {
    // We already cleared cart on place order, but this is a fallback.
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
      <h1 className="font-integral font-black text-4xl mb-4">Payment Successful!</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Thank you for your purchase. Your payment was successful and your order is now confirmed.
        {sessionId && <span className="block mt-2 text-xs text-gray-400">Transaction ID: {sessionId}</span>}
      </p>
      
      <div className="flex justify-center gap-4">
        <Link href="/profile" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
          View My Orders
        </Link>
        <Link href="/shop" className="bg-gray-100 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

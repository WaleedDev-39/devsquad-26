'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <XCircle size={80} className="text-red-500 mx-auto mb-6" />
      <h1 className="font-integral font-black text-4xl mb-4">Payment Cancelled</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Your payment was cancelled and your order has not been completed. 
        If you used any loyalty points, they will be refunded shortly.
      </p>
      
      <div className="flex justify-center gap-4">
        {orderId && (
          <Link href={`/orders/${orderId}`} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            View Order
          </Link>
        )}
        <Link href="/cart" className="bg-gray-100 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
          Return to Cart
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}

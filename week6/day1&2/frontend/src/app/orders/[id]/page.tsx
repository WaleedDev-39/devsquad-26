'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
  const order: Order = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-36 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package size={48} className="text-gray-300 mx-auto mb-4" />
        <h1 className="font-bold text-xl">Order not found</h1>
        <Link href="/profile" className="mt-4 inline-block text-sm text-black underline">← Back to profile</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Profile
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-integral font-black text-2xl sm:text-3xl">ORDER DETAILS</h1>
          <p className="text-gray-400 text-sm mt-1">
            #{order._id.slice(-8).toUpperCase()} •{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <span className={`text-sm font-medium px-4 py-2 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="border border-gray-200 rounded-2xl p-5 mb-5">
          <p className="font-bold text-sm mb-5">Order Progress</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200 z-0">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
              />
            </div>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all
                  ${i <= currentStep ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="text-[10px] text-gray-500 capitalize hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <h2 className="font-bold text-sm mb-4">Items ({order.items.length})</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative w-16 h-16 bg-[#F2F0F1] rounded-xl overflow-hidden flex-shrink-0">
                {item.image && <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + Shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-red-500">-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-100 pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
          {order.loyaltyPointsEarned > 0 && (
            <p className="text-xs text-yellow-600 mt-3 font-medium">🪙 +{order.loyaltyPointsEarned} points earned</p>
          )}
        </div>

        <div className="border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-500 space-y-1">
            <p className="font-medium text-black">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p>{order.shippingAddress?.country}</p>
            {order.shippingAddress?.phone && <p>{order.shippingAddress.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

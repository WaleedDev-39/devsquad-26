'use client';

import Link from 'next/link';
import { Calendar, Printer, Shield, User, MapPin, Search, ShoppingBag, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Order } from '@/types';
import Image from 'next/image';

export default function OrderDetails({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await adminApi.getOrders();
      return res.data;
    },
  });

  const order = orders?.find((o: Order) => o._id === params.id);

  const statusMutation = useMutation({
    mutationFn: (status: string) => adminApi.updateOrderStatus(params.id, status),
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error('Failed to update order status'),
  });

  if (isLoading) return <div className="p-10 text-center">Loading order...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-integral">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">Home &gt; Order List &gt; Order Details</p>
        </div>
        <button className="bg-[#212121] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-black transition-colors">
          <Printer size={18} /> INVOICE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Order ID: #{order._id.substring(order._id.length - 6).toUpperCase()}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <select 
                  value={order.status}
                  onChange={(e) => statusMutation.mutate(e.target.value)}
                  disabled={statusMutation.isPending}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 font-bold capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
             </div>
             
             <div className="mb-4">
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                   <span className={order.status !== 'cancelled' ? 'text-black' : 'text-gray-400'}>Order Added</span>
                   <span className={['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-400'}>Processing</span>
                   <span className={['shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-400'}>Order Shipped</span>
                   <span className={order.status === 'delivered' ? 'text-black' : 'text-gray-400'}>Delivered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                   <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ 
                         width: order.status === 'delivered' ? '100%' : 
                                order.status === 'shipped' ? '75%' : 
                                order.status === 'processing' ? '50%' : '10%' 
                      }}
                    ></div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
               <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                 <ShoppingBag size={20} className="text-gray-400"/> Order items 
                 <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{order.items.length}</span>
               </h2>
               <button className="text-gray-400 hover:text-black"><MoreVertical size={20}/></button>
             </div>
             
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-y border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item: any) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden">
                              <Image 
                                src={item.image ? (item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `${process.env.NEXT_PUBLIC_API_URL}${item.image}`) : '/placeholder.png'} 
                                alt={item.name} 
                                fill 
                                className="object-cover" 
                              />
                           </div>
                           <span className="font-bold text-gray-900 truncate max-w-[150px]">{item.name}</span>
                         </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-600">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 font-semibold text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Summary</h2>
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between items-center text-gray-600 font-semibold">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600 font-semibold">
                    <span>Shipping</span>
                    <span className="text-gray-900">₹{order.deliveryFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600 font-semibold">
                    <span>Discount</span>
                    <span className="text-gray-900">-₹{order.discount.toFixed(2)}</span>
                 </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center font-bold text-lg">
                 <span>Total</span>
                 <span className="text-red-500">₹{order.total.toFixed(2)}</span>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Customer Note</h2>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                    <User size={24} />
                 </div>
                 <div>
                    <p className="font-bold text-sm text-gray-900">
                      {typeof order.userId === 'object' ? order.userId.name : 'Guest User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof order.userId === 'object' ? order.userId.email : 'N/A'}
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                       <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 mb-1">Billing Address</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                         {order.shippingAddress.address}<br />
                         {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                         {order.shippingAddress.country}
                      </p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                       <Shield size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 mb-1">Payment Method</p>
                      <p className="text-xs text-gray-500">Not Provided (Mock)</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

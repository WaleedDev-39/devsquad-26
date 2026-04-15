'use client';

import Link from 'next/link';
import { Eye, Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Order } from '@/types';

export default function AdminOrders() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        const res = await adminApi.getOrders();
        return res.data;
      } catch (err) {
        console.error('AdminOrders Fetch Error:', err);
        throw err;
      }
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading orders...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load orders.</div>;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-integral">Orders List</h1>
        <p className="text-sm text-gray-500 mt-1">Home &gt; Order List</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Controls */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="relative w-72">
             <input type="text" placeholder="Search orders..." className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-black" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           
           <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50">
               <Filter size={16} /> Filter By Status
             </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((order: Order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 border-l-4 border-transparent hover:border-black">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-semibold text-gray-800">
                       {order.shippingAddress?.fullName || (typeof order.userId === 'object' ? order.userId.name : 'Guest')}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold">₹{order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none inline-flex items-center justify-center capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'processing' ? 'bg-orange-100 text-orange-700' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}
                     >
                        {order.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/orders/${order._id}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

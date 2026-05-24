'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, MoreVertical, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Product, Order } from '@/types';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fetch Dashboard Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await adminApi.getStats();
      return res.data;
    },
  });

  // Fetch Sales Graph Data
  const { data: graphData, isLoading: graphLoading } = useQuery({
    queryKey: ['admin-graph'],
    queryFn: async () => {
      const res = await adminApi.getSalesGraph();
      return res.data || [];
    },
  });

  // Fetch Best Sellers
  const { data: bestSellers, isLoading: bestSellersLoading } = useQuery({
    queryKey: ['admin-best-sellers'],
    queryFn: async () => {
      const res = await adminApi.getBestSellers(3);
      return res.data;
    },
  });

  // Fetch Recent Orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders', 'recent'],
    queryFn: async () => {
      const res = await adminApi.getOrders();
      return res.data.slice(0, 6); // Just take the latest 6
    },
  });

  const isLoading = statsLoading || graphLoading || bestSellersLoading || ordersLoading;

  if (isLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-integral">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Home &gt; Dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Calendar size={18} className="text-gray-500" />
          {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Sales', value: `₹${stats?.totalSales?.toLocaleString() || '0'}`, inc: '34.7%' },
          { label: 'Total Orders', value: stats?.totalOrders || '0', inc: '12.4%' },
          { label: 'Active Orders', value: stats?.activeOrders || '0', inc: '8.1%' },
          { label: 'Completed Orders', value: stats?.completedOrders || '0', inc: '15.2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <MoreVertical size={18} />
            </button>
            <h3 className="text-sm font-bold text-gray-800 mb-4">{stat.label}</h3>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003B73] rounded-xl flex items-center justify-center text-white">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-bold text-xl">{stat.value}</span>
              </div>
              <div className="text-xs font-semibold text-green-600 flex flex-col items-end">
                <span className="flex items-center">↑ {stat.inc}</span>
                <span className="text-[10px] text-gray-400 font-normal mt-1">Overall</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graph and Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Sale Graph</h2>
            <div className="flex gap-2 text-xs font-bold font-satoshi list-none">
               <button className="px-4 py-1.5 rounded-full bg-[#003B73] text-white">MONTHLY</button>
            </div>
          </div>
          <div className="h-[250px] w-full">
            {mounted && graphData && graphData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip wrapperStyle={{ outline: 'none' }} cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">No sales data available for graph</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Best Sellers</h2>
            <button className="text-gray-400 hover:text-black"><MoreVertical size={18}/></button>
          </div>
          <div className="flex-1 flex flex-col justify-around">
             {bestSellers?.map((item: Product, idx: number) => (
                <div key={idx} className="flex justify-between items-center px-2 py-1">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative">
                       <Image src={getImageUrl(item.images?.[0]) || '/placeholder.png'} alt={item.name || 'Product'} fill className="object-cover" />
                    </div>
                    <div className="max-w-[100px]">
                      <h4 className="font-bold text-sm truncate">{item.name || 'Unnamed Product'}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">₹{(item.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-sm">₹{(item.price || 0).toFixed(2)}</p>
                     <p className="text-xs text-gray-500 mt-0.5">{item.reviewCount || 0} reviews</p>
                  </div>
                </div>
             ))}
          </div>
          <button className="w-max mt-4 px-6 py-2 bg-[#003B73] text-white rounded-lg text-xs font-bold">
            REPORT
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <button className="text-gray-400 hover:text-black"><MoreVertical size={18}/></button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-gray-500 font-semibold border-b-2 border-gray-100">
                <th className="pb-4 font-bold">Order ID</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">Customer Name</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Amount</th>
                <th className="pb-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order: Order) => (
                <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900 border-l-4 border-transparent hover:border-[#003B73] pl-2">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </td>
                  <td className="py-4 font-semibold text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-4 font-bold text-gray-800">
                     {order.shippingAddress?.fullName || 'Guest User'}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'processing' ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-100 text-blue-700'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-gray-900">₹{order.totalAmount?.toFixed(2) || order.total?.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <Link href={`/admin/orders/${order._id}`} className="text-[#003B73] font-bold text-xs hover:underline">
                      VIEW
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

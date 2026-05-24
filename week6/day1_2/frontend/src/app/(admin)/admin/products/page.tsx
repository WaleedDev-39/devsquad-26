'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () => {
      try {
        const res = await adminApi.getProducts({ page, limit: 9 });
        return res.data;
      } catch (err) {
        console.error('AdminProducts Fetch Error:', err);
        throw err;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error('Failed to delete product'),
  });

  if (isLoading) return <div className="p-10 text-center">Loading products...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load products.</div>;

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-integral">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">Home &gt; All Products</p>
        </div>
        <Link href="/admin/products/add" className="bg-[#212121] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-black transition-colors">
          <Plus size={18} strokeWidth={3} /> ADD NEW PRODUCT
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative group">
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Link href={`/admin/products/edit/${product._id}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200">Edit</Link>
              <button 
                onClick={() => { if (confirm('Are you sure?')) deleteMutation.mutate(product._id) }}
                className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200"
              >
                Delete
              </button>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                {product.images?.[0] ? (
                  <Image src={getImageUrl(product.images[0]) || ''} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">img</div>
                )}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-gray-900 border-b border-transparent truncate max-w-[150px]">{product.name || 'Unnamed Product'}</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-2">{product.category || 'Uncategorized'}</p>
                <div className="font-bold text-sm">₹{(product.price || 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-1">Summary</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                 {product.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-auto space-y-3 p-4 rounded-xl border border-gray-100 text-sm font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Sales</span>
                <span className="text-orange-500 flex items-center gap-1">↑ {product.reviewCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Remaining Stock</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400" style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}></div>
                  </div>
                  <span className="text-gray-600 w-8 text-right">{product.stock}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded border text-sm font-bold ${page === i + 1 ? 'bg-black text-white border-black' : 'border-gray-300 hover:bg-gray-50 text-gray-700 bg-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { Product, FilterState } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FiltersSidebar from '@/components/shop/FiltersSidebar';
import FiltersDrawer from '@/components/shop/FiltersDrawer';
import Pagination from '@/components/shop/Pagination';

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || undefined,
    style: searchParams.get('style') || undefined,
    sort: searchParams.get('sort') || 'newest',
    page: 1,
  });

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      category: searchParams.get('category') || undefined,
      style: searchParams.get('style') || undefined,
    }));
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['shop-products', filters],
    queryFn: () => productsApi.getAll({ ...filters, limit: 9 }),
  });

  const products: Product[] = data?.data?.products || [];
  const total: number = data?.data?.total || 0;
  const totalPages: number = data?.data?.totalPages || 1;
  const currentPage = filters.page || 1;

  const title = filters.category || filters.style || (searchParams.get('arrivals') ? 'New Arrivals' : 'All Products');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: title }]} />

      <div className="flex gap-8 mt-6">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-integral font-black text-2xl capitalize">{title}</h1>
              {!isLoading && (
                <span className="text-gray-400 text-sm">
                  Showing {(currentPage - 1) * 9 + 1}–{Math.min(currentPage * 9, total)} of {total} Products
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Filter btn — mobile */}
              <button
                className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50"
                  onClick={() => setSortOpen((p) => !p)}
                >
                  Sort by: {SORT_OPTIONS.find((o) => o.value === filters.sort)?.label || 'Newest'}
                  <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filters.sort === opt.value ? 'font-bold' : ''}`}
                        onClick={() => { setFilters((f) => ({ ...f, sort: opt.value, page: 1 })); setSortOpen(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))
              : products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>

          {!isLoading && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl font-medium">No products found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      <FiltersDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onFiltersChange={(f) => { setFilters(f); setDrawerOpen(false); }}
      />
    </div>
  );
}

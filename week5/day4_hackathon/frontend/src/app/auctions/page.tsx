'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBanner from '@/components/PageBanner';
import LiveAuctionCard from '@/components/LiveAuctionCard';
import api from '@/lib/api';

function AuctionsList() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    color: searchParams.get('color') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    style: searchParams.get('style') || '',
    sort: 'newest',
  });

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetchMakes();
  }, []);

  useEffect(() => {
    if (filters.make) {
      fetchModels(filters.make);
    } else {
      setModels([]);
    }
  }, [filters.make]);

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchMakes = async () => {
    try {
      const res = await api.get('/cars/makes');
      setMakes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchModels = async (make: string) => {
    try {
      const res = await api.get(`/cars/models?make=${make}`);
      setModels(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters as any).toString();
      const res = await api.get(`/cars?${query}`);
      setCars(res.data.cars);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: prev[key as keyof typeof prev] === value ? '' : value }));
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left/Main Column - Grid */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <span className="text-gray-500 font-medium">Showing Results : <span className="text-black">{total}</span></span>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">Sort By :</span>
              <select 
                className="border border-gray-200 rounded px-2 py-1 text-sm font-medium outline-none focus:border-primary"
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="ending_soon">Ending Soon</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading auctions...</div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm">No cars found matching your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {cars.slice(0, visibleCount).map((car: any) => (
                  <LiveAuctionCard key={car._id} car={car} />
                ))}
              </div>
              
              {visibleCount < cars.length && (
                <div className="text-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="btn-outline"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Filters */}
        <div className="w-full lg:w-72 order-1 lg:order-2 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
            <h3 className="text-xl font-bold border-b pb-4 mb-6">Filter By</h3>
            
            {/* Filter sections based on design */}
            <div className="space-y-6">
              <FilterSection 
                title="Car Category" 
                options={[
                  { label: 'Dealer', value: 'dealer', count: 12 },
                  { label: 'Private Seller', value: 'private', count: 5 }
                ]}
                selected={filters.category}
                onChange={(v: string) => handleFilterChange('category', v)}
              />

              <FilterSection 
                title="Color" 
                options={[
                  { label: 'Black', value: 'black', count: 8 },
                  { label: 'White', value: 'white', count: 6 },
                  { label: 'Red', value: 'red', count: 3 }
                ]}
                selected={filters.color}
                onChange={(v: string) => handleFilterChange('color', v)}
              />

              <FilterSection 
                title="Makes" 
                options={makes.map(m => ({ label: m, value: m, count: null }))}
                selected={filters.make}
                onChange={(v: string) => handleFilterChange('make', v)}
              />

              {models.length > 0 && (
                <FilterSection 
                  title="Car Model" 
                  options={models.map(m => ({ label: m, value: m, count: null }))}
                  selected={filters.model}
                  onChange={(v: string) => handleFilterChange('model', v)}
                />
              )}

              <FilterSection 
                title="Style" 
                options={[
                  { label: 'Sedan', value: 'sedan', count: 12 },
                  { label: 'Coupe', value: 'coupe', count: 12 },
                  { label: 'Hatchabk', value: 'hatchback', count: 12 }
                ]}
                selected={filters.style}
                onChange={(v: string) => handleFilterChange('style', v)}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, onChange }: any) {
  return (
    <div>
      <h4 className="font-semibold mb-3 flex justify-between items-center">
        {title}
        <span className="text-gray-400 text-xs">▼</span>
      </h4>
      <div className="space-y-2">
        {options.map((opt: any) => (
          <label key={opt.value} className="flex items-center cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${selected === opt.value ? 'bg-primary border-primary' : 'border-gray-300'}`}>
              {selected === opt.value && <div className="w-2 h-2 bg-white rounded-sm" />}
            </div>
            <span className={`text-sm flex-1 ${selected === opt.value ? 'font-medium text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
              {opt.label}
            </span>
            {opt.count !== null && <span className="text-xs text-gray-400">[{opt.count}]</span>}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AuctionsPage() {
  return (
    <div>
      <PageBanner 
        title="Auction Listing" 
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Auction Listing' }]} 
      />
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
         <AuctionsList />
      </Suspense>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBanner from '@/components/PageBanner';
import HorizontalAuctionCard from '@/components/HorizontalAuctionCard';
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
          <div className="flex justify-between items-center bg-[#3B4C8A] px-6 py-4 rounded mb-6">
            <span className="text-white text-sm font-medium">Showing 1-{Math.min(visibleCount, total)} of {total} Results</span>
            
            <div className="flex items-center">
              <select 
                className="bg-white text-gray-700 border-none rounded px-3 py-1.5 text-sm font-medium outline-none cursor-pointer w-40"
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="newest">Sort By: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
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
              <div className="flex flex-col mb-10">
                {cars.slice(0, visibleCount).map((car: any) => (
                  <HorizontalAuctionCard key={car._id} car={car} />
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
        <div className="w-full lg:w-[300px] order-1 lg:order-2 flex-shrink-0">
          <div className="bg-[#3B4C8A] rounded-md shadow-sm p-6 sticky top-4">
            <div className="border-b border-white/20 pb-3 mb-6">
              <h3 className="text-[15px] font-semibold text-white">Filter By</h3>
            </div>
            
            {/* Filter sections based on design */}
            <div className="space-y-4">
              <select 
                className="w-full bg-transparent border border-white/20 text-gray-300 px-4 py-2.5 rounded text-[13px] outline-none"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="" className="text-black">Any Car Type</option>
                <option value="dealer" className="text-black">Dealer</option>
                <option value="private" className="text-black">Private Seller</option>
              </select>

              <select 
                className="w-full bg-transparent border border-white/20 text-gray-300 px-4 py-2.5 rounded text-[13px] outline-none"
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              >
                <option value="" className="text-black">Any Color</option>
                <option value="black" className="text-black">Black</option>
                <option value="white" className="text-black">White</option>
                <option value="red" className="text-black">Red</option>
              </select>

              <select 
                className="w-full bg-transparent border border-white/20 text-gray-300 px-4 py-2.5 rounded text-[13px] outline-none"
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              >
                <option value="" className="text-black">Any Makes</option>
                {makes.map(m => (
                  <option key={m} value={m} className="text-black">{m}</option>
                ))}
              </select>

              <select 
                className="w-full bg-transparent border border-white/20 text-gray-300 px-4 py-2.5 rounded text-[13px] outline-none"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                disabled={!filters.make || models.length === 0}
              >
                <option value="" className="text-black">Any Car Model</option>
                {models.map(m => (
                  <option key={m} value={m} className="text-black">{m}</option>
                ))}
              </select>

              <select 
                className="w-full bg-transparent border border-white/20 text-gray-300 px-4 py-2.5 rounded text-[13px] outline-none"
                value={filters.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
              >
                <option value="" className="text-black">Any Style</option>
                <option value="sedan" className="text-black">Sedan</option>
                <option value="coupe" className="text-black">Coupe</option>
                <option value="hatchback" className="text-black">Hatchback</option>
              </select>

              <div className="pt-6 pb-2">
                <div className="relative h-2 bg-white/20 rounded-full mb-4">
                  <div className="absolute top-0 left-0 h-full bg-[#F5A623] rounded-full w-full"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-white rounded-full shadow-md"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              <button className="w-full bg-[#F5A623] text-[#3B4C8A] font-bold py-2.5 rounded text-[13px] hover:bg-[#e0951c] transition-colors">
                Filter
              </button>
              
              <div className="text-center mt-3">
                <span className="text-[11px] text-white">Price: $30,000 - $30,000</span>
              </div>
            </div>
          </div>
        </div>

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

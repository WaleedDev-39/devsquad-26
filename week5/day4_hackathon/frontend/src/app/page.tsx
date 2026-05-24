'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ChevronDown } from 'lucide-react';
import LiveAuctionCard from '@/components/LiveAuctionCard';
import api from '@/lib/api';

export default function Home() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  });

  useEffect(() => {
    fetchLiveAuctions();
    fetchMakes();
  }, []);

  const fetchLiveAuctions = async () => {
    try {
      const res = await api.get('/cars/live');
      setLiveAuctions(res.data);
    } catch (error) {
      console.error('Error fetching live auctions', error);
    }
  };

  const fetchMakes = async () => {
    try {
      const res = await api.get('/cars/makes');
      setMakes(res.data);
    } catch (error) {
      console.error('Error fetching makes', error);
    }
  };

  const fetchModels = async (make: string) => {
    try {
      const res = await api.get(`/cars/models?make=${make}`);
      setModels(res.data);
    } catch (error) {
      console.error('Error fetching models', error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => currentYear - index);

  return (
    <div className='mb-14'> 
      {/* Hero Section */}
      <div className="relative pt-40 pb-48 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/hero_img.png')" }}>
        <div className="absolute inset-0 bg-[#121B2A]/50 z-0"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-2xl mt-8">
            <span className="inline-block bg-[#D3E1F7] text-[#3B4C8A] font-bold px-4 py-2 rounded text-sm mb-6 uppercase tracking-wider">WELCOME TO AUCTION</span>
            <h1 className="text-5xl md:text-[72px] font-medium text-white mb-6 leading-[1.1]">
              Find Your <br />
              Dream Car
            </h1>
            <p className="text-gray-200 text-sm md:text-base mb-8 max-w-md font-light leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus elementum cursus tincidunt sagittis elementum suspendisse velit arcu.
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter Box - Floating over hero */}
      <div className="container mx-auto max-w-5xl px-4 relative -mt-16 z-20 mb-20">
        <div className="bg-white rounded-lg shadow-2xl flex items-center p-2">
            <div className="flex-1 flex items-center divide-x divide-gray-100 px-2">
                <div className="flex-1 px-4 cursor-pointer relative">
                    <span className="text-[11px] text-gray-400 font-medium block mb-1">Make</span>
                    <div className="relative">
                      <select 
                        className="w-full font-semibold text-sm text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer"
                        value={filters.make}
                        onChange={(e) => {
                          setFilters({...filters, make: e.target.value});
                          fetchModels(e.target.value);
                        }}
                      >
                          <option value="">Audi</option>
                          {makes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1 px-4 cursor-pointer relative">
                    <span className="text-[11px] text-gray-400 font-medium block mb-1">Model</span>
                    <div className="relative">
                      <select 
                        className="w-full font-semibold text-sm text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer"
                        value={filters.model}
                        onChange={(e) => setFilters({...filters, model: e.target.value})}
                      >
                          <option value="">Model</option>
                          {models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1 px-4 cursor-pointer relative">
                    <span className="text-[11px] text-gray-400 font-medium block mb-1">Year</span>
                    <div className="relative">
                      <select 
                        className="w-full font-semibold text-sm text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer"
                        value={filters.year}
                        onChange={(e) => setFilters({...filters, year: e.target.value})}
                      >
                          <option value="">Year</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1 px-4 cursor-pointer relative">
                    <span className="text-[11px] text-gray-400 font-medium block mb-1">Price</span>
                    <div className="relative">
                      <select 
                        className="w-full font-semibold text-sm text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer"
                        value={filters.price}
                        onChange={(e) => setFilters({...filters, price: e.target.value})}
                      >
                          <option value="">Price</option>
                          <option value="0-5000">Under $5k</option>
                          <option value="5000-15000">$5k - $15k</option>
                          <option value="15000-30000">$15k - $30k</option>
                          <option value="30000+">$30k+</option>
                      </select>
                      <ChevronDown size={14} className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="pl-4">
                    <button className="bg-[#3B4C8A] hover:bg-[#2A3765] text-white flex items-center space-x-2 py-3 px-8 rounded text-sm transition-colors"
                      onClick={() => {
                        window.location.href = `/auctions?make=${filters.make}&model=${filters.model}&year=${filters.year}`;
                      }}
                    >
                        <Search size={18} />
                        <span>Search</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Live Auctions Section */}
      <div className="bg-[#3B4C8A] pt-16 pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14 relative">
            <h2 className="text-4xl font-semibold text-white mb-6">Live Auction</h2>
            <div className="flex items-center justify-center relative">
              <div className="h-[1px] w-64 bg-white/40 absolute"></div>
              <div className="w-4 h-4 bg-secondary rotate-45 relative z-10"></div>
            </div>
          </div>

          <div className="border-b border-white/20 mb-8 relative">
            <span className="text-white font-medium text-base inline-block border-b-2 border-secondary pb-3 px-2 absolute bottom-[-1px] left-8">Live Auction</span>
            <div className="h-10"></div>
          </div>

          {liveAuctions.length === 0 ? (
            <div className="text-center py-20 text-gray-300">
              No live auctions currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveAuctions.map((car: any) => (
                <LiveAuctionCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

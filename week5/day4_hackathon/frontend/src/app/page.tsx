'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#D3E1F7] pt-20 pb-40 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 uppercase tracking-wider">
              Find Your <br />
              <span className="text-primary-dark">Dream Car</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Lorem ipsum dolor sit amet consectetur. Est at in aliquam in augue iaculis tristique in. 
              Risus commodo ut enim eget in mattis sit nullam. 
            </p>
          </div>
        </div>
        
        {/* Abstract Car Background Graphic (Placeholder) */}
        <div className="absolute top-10 right-0 w-2/3 h-full opacity-30 select-none z-0">
            <div className="w-full h-full bg-[url('/placeholder-car.jpg')] bg-contain bg-no-repeat bg-right opacity-30" />
        </div>
      </div>

      {/* Search Filter Box - Floating over hero */}
      <div className="container mx-auto max-w-5xl px-4 relative -mt-24 z-20 mb-20">
        <div className="bg-primary-dark rounded-xl shadow-xl flex items-center p-2">
            <div className="flex-1 bg-white rounded-lg flex items-center divide-x px-4 py-2">
                <div className="flex-1 px-4 cursor-pointer">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Make</span>
                    <select 
                      className="w-full font-semibold focus:outline-none bg-transparent appearance-none"
                      value={filters.make}
                      onChange={(e) => {
                        setFilters({...filters, make: e.target.value});
                        fetchModels(e.target.value);
                      }}
                    >
                        <option value="">Any Make</option>
                        {makes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="flex-1 px-4 cursor-pointer">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Model</span>
                    <select 
                      className="w-full font-semibold focus:outline-none bg-transparent appearance-none"
                      value={filters.model}
                      onChange={(e) => setFilters({...filters, model: e.target.value})}
                    >
                        <option value="">Any Model</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="flex-1 px-4 cursor-pointer">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Year</span>
                    <select 
                      className="w-full font-semibold focus:outline-none bg-transparent appearance-none"
                      value={filters.year}
                      onChange={(e) => setFilters({...filters, year: e.target.value})}
                    >
                        <option value="">Any Year</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="flex-1 px-4 cursor-pointer">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Price</span>
                    <select 
                      className="w-full font-semibold focus:outline-none bg-transparent appearance-none"
                      value={filters.price}
                      onChange={(e) => setFilters({...filters, price: e.target.value})}
                    >
                        <option value="">Any Price</option>
                        <option value="0-5000">Under $5k</option>
                        <option value="5000-15000">$5k - $15k</option>
                        <option value="15000-30000">$15k - $30k</option>
                        <option value="30000+">$30k+</option>
                    </select>
                </div>
                <div className="pl-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md uppercase text-sm transition-colors"
                      onClick={() => {
                        window.location.href = `/auctions?make=${filters.make}&model=${filters.model}&year=${filters.year}`;
                      }}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Live Auctions Section */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-primary relative inline-block">
              Live Auction
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary"></span>
            </h2>
          </div>
          <a href="/auctions" className="text-primary font-medium hover:underline flex items-center">
            View All <span className="ml-1">→</span>
          </a>
        </div>

        {liveAuctions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
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

      {/* Trust/Benefits Section */}
      <div className="bg-primary text-white py-16 mt-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-secondary">Secure Payments</h3>
              <p className="text-sm text-gray-300">Bid with confidence. Your funds are secured until you confirm the vehicle.</p>
            </div>
            <div className="flex flex-col items-center border-l border-r border-white border-opacity-20 px-4">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-secondary">Real-Time Bidding</h3>
              <p className="text-sm text-gray-300">Experience the thrill of live auctions with instant bid updates and notifications.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-secondary">Verified Vehicles</h3>
              <p className="text-sm text-gray-300">All vehicles pass a comprehensive history check before being listed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

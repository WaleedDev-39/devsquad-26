'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/api';
import PageBanner from '@/components/PageBanner';

export default function AuctionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [car, setCar] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeLeftStr, setTimeLeftStr] = useState('');
  
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchCarDetails();
    fetchBids();

    const socket = getSocket();
    socket.connect();
    socket.emit('join:auction', { carId: id });

    socket.on('bid:new', (data) => {
      setCar((prev: any) => ({
        ...prev,
        currentBid: data.currentBid,
        totalBids: data.totalBids,
      }));
      setBids((prev) => [data.bid, ...prev]);
    });

    return () => {
      socket.emit('leave:auction', { carId: id });
      socket.off('bid:new');
    };
  }, [id]);

  useEffect(() => {
    if (!car) return;
    
    // Set initial bid amount to current + minIncrement
    setBidAmount(car.currentBid + car.minIncrement);
    
    const calculateTimeLeft = () => {
      const difference = new Date(car.endTime).getTime() - new Date().getTime();
      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
        setTimeLeftStr(`${d}d ${h}h ${m}m ${s}s`);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimeLeftStr('Auction Ended');
        if (car.status === 'active') {
          api.patch(`/cars/${id}/end`).catch(console.error);
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [car]);

  const fetchCarDetails = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/car/${id}`);
      setBids(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceBid = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    setError('');
    try {
      await api.post('/bids', {
        carId: id,
        amount: bidAmount,
      });
      // socket event will update state
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error placing bid');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!car) return <div className="text-center py-20">Car not found</div>;

  const isWinner = car.winner?._id === user?._id;
  const showPaymentButton = car.status === 'ended' && isWinner && car.paymentStatus === 'pending';

  return (
    <div>
      <PageBanner 
        title={car.title} 
        subtitle="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Auction Detail' }]} 
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        
        {/* Title Bar */}
        <div className="bg-[#3B4C8A] text-white px-6 py-3 rounded mb-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">{car.title}</h1>
          <button className="text-white hover:text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Gallery & Info */}
          <div className="lg:w-3/4">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Main Image */}
              <div className="flex-1 relative h-[400px] md:h-[500px] rounded overflow-hidden bg-gray-100">
                <div className="absolute top-4 left-4 z-10">
                   <span className="bg-[#E8463A] text-white px-3 py-1 text-[10px] font-bold rounded flex items-center">
                     Live Bid
                   </span>
                </div>
                <Image 
                  src={car.photos && car.photos[activeImage] ? (car.photos[activeImage].startsWith('http') ? car.photos[activeImage] : `http://localhost:5000${car.photos[activeImage].startsWith('/') ? '' : '/'}${car.photos[activeImage]}`) : '/placeholder-car.jpg'} 
                  alt={car.title} 
                  fill 
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover" 
                />
              </div>
              
              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 gap-2 w-full md:w-[350px]">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="relative h-[120px] md:h-auto rounded overflow-hidden bg-gray-100 cursor-pointer">
                    {car.photos && car.photos[idx] ? (
                      <Image 
                        src={car.photos[idx].startsWith('http') ? car.photos[idx] : `http://localhost:5000${car.photos[idx].startsWith('/') ? '' : '/'}${car.photos[idx]}`} 
                        alt="" 
                        fill 
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 15vw"
                        className="object-cover hover:opacity-80 transition-opacity"
                        onClick={() => setActiveImage(idx)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-[#F2F6FE] rounded p-6 flex flex-wrap gap-8 mb-8">
               <div>
                  <div className="flex gap-1.5 mb-1">
                    {[
                      { val: timeLeft.days, label: 'Days' },
                      { val: timeLeft.hours, label: 'Hrs' },
                      { val: timeLeft.minutes, label: 'Min' },
                      { val: timeLeft.seconds, label: 'Sec' }
                    ].map((t, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded px-1 py-0.5 text-center min-w-[32px]">
                        <p className="text-[#3B4C8A] font-bold text-xs">{String(t.val).padStart(2, '0')}</p>
                        <p className="text-[7px] text-gray-400 uppercase">{t.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">Time Left</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">${(car.currentBid || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Current Bid</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">{new Date(car.endTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  <p className="text-[10px] text-gray-400 mt-1">End Time</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">{car.minIncrement || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Min. Increment</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">{car.totalBids || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Total Bids</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">{car.lotNumber || 'N/A'}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Lot No.</p>
               </div>
               <div>
                  <p className="text-[#3B4C8A] font-bold text-xs">{car.mileage?.toLocaleString() || 0} K.M</p>
                  <p className="text-[10px] text-gray-400 mt-1">Odometer</p>
               </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-[17px] font-bold text-[#3B4C8A] inline-block border-b-4 border-[#F5A623] pb-1 mb-6">Description</h3>
              <div className="space-y-4 text-gray-500 text-[13px] leading-relaxed pr-10">
                <p>
                  Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod.
                </p>
                <p>
                  In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut rem placerat placerat amet vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio leo in et in. Ac purus morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a fringilla quam varius pellentesque.
                </p>
              </div>
            </div>

            {/* Top Bidder */}
            <div className="bg-[#F2F6FE] rounded overflow-hidden">
               <div className="bg-[#3B4C8A] px-6 py-2.5">
                  <h3 className="text-white text-sm font-bold">Top Bidder</h3>
               </div>
               <div className="p-6 flex items-center gap-10">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                    <Image 
                      src={bids[0]?.bidder?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"} 
                      alt={bids[0]?.bidder?.fullName || "No Bidder"} 
                      fill 
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap gap-x-20 gap-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-[#3B4C8A]">Full Name</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{bids[0]?.bidder?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#3B4C8A]">Mobile Number</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{bids[0]?.bidder?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#3B4C8A]">ID Type</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{bids[0]?.bidder?.idType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#3B4C8A]">Email</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{bids[0]?.bidder?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#3B4C8A]">Nationality</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{bids[0]?.bidder?.nationality || 'N/A'}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column - Bidding Panel */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-[#F2F6FE] rounded p-6 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[#3B4C8A] font-bold text-xs">${car.startingBid?.toLocaleString() || 0}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">Starting From</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#3B4C8A] font-bold text-xs">${car.currentBid?.toLocaleString() || 0}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">Current Bid</p>
                  </div>
               </div>
               
               <div className="relative h-1.5 bg-white rounded-full mb-6">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#F5A623] rounded-full" 
                    style={{ width: `${Math.min(100, ((car.currentBid - car.startingBid) / car.startingBid) * 100) || 0}%` }}
                  ></div>
               </div>

               <div className="mb-6">
                  <p className="text-[#3B4C8A] font-bold text-[13px]">{car.totalBids || 0}</p>
                  <p className="text-[10px] text-gray-400">Bids Placed</p>
               </div>

               <div className="flex items-center border border-gray-200 rounded bg-white overflow-hidden mb-2">
                  <button 
                    onClick={() => setBidAmount(prev => Math.max(car.currentBid + car.minIncrement, prev - car.minIncrement))}
                    className="px-3 py-2 text-[#3B4C8A] hover:bg-gray-50"
                  > - </button>
                  <input 
                    type="number" 
                    value={bidAmount} 
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="flex-1 text-center font-bold text-[#3B4C8A] text-xs outline-none"
                  />
                  <button 
                    onClick={() => setBidAmount(prev => prev + car.minIncrement)}
                    className="px-3 py-2 text-[#3B4C8A] hover:bg-gray-50"
                  > + </button>
               </div>
               {error && <p className="text-red-500 text-[10px] mb-4 text-center">{error}</p>}

               <button 
                 onClick={handlePlaceBid}
                 disabled={car.status !== 'active'}
                 className="w-full bg-[#3B4C8A] text-white py-2.5 rounded font-bold text-[13px] hover:bg-[#2A3765] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {car.status === 'active' ? 'Submit A Bid' : 'Auction Ended'}
               </button>
            </div>

            {/* Bidders List Sidebar */}
            <div className="bg-[#F2F6FE] rounded overflow-hidden">
               <div className="bg-[#3B4C8A] px-6 py-2.5">
                  <h3 className="text-white text-[13px] font-bold">Bidders List</h3>
               </div>
               <div className="p-0">
                  <ul className="divide-y divide-gray-200/50 max-h-[300px] overflow-y-auto">
                    {bids.length > 0 ? bids.map((b, i) => (
                      <li key={i} className="px-6 py-3 flex justify-between items-center">
                        <span className="text-[11px] text-gray-500">{b.bidder?.fullName || 'Unknown'}</span>
                        <span className="text-[11px] font-bold text-[#3B4C8A]">$ {b.amount?.toLocaleString()}</span>
                      </li>
                    )) : (
                      <li className="px-6 py-4 text-gray-400 text-[11px] text-center">No bids yet</li>
                    )}
                  </ul>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

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
  const [timeLeft, setTimeLeft] = useState<string>('');
  
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
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      } else {
        setTimeLeft('Auction Ended');
        if (car.status === 'active') {
          // Trigger backend logic to end auction if not already ended
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
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Auction Listing', path: '/auctions' }, { label: car.title }]} 
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Gallery & Info */}
          <div className="lg:w-2/3">
            {/* Main Image */}
            <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
              <Image 
                src={car.photos && car.photos.length > 0 ? `http://localhost:5000${car.photos[activeImage]}` : '/placeholder-car.jpg'} 
                alt={car.title} 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Thumbnails */}
            {car.photos && car.photos.length > 1 && (
              <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {car.photos.map((photo: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
                  >
                    <Image src={`http://localhost:5000${photo}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Description Tabs */}
            <div className="mt-8">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 border-b-2 border-primary text-primary font-bold">Description</button>
                <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 font-medium hover:text-primary transition-colors">Specifications</button>
              </div>
              <div className="py-6 text-gray-600 leading-relaxed font-light">
                {car.description || (
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Adipiscing eget quam dictum nisl pellentesque egestas. 
                    Id elementum suspendisse arcu faucibus augue ut sit id nullam. Tellus faucibus egestas ultrices facilisis 
                    scelerisque cursus sit arcu duis. Amet nulla morbi in proin facilisi. Tincidunt tellus ac at vulputate cras eget 
                    aliquam. Quis facilisi arcu adipiscing elit cursus nunc. Eget mauris donec pulvinar nec quis cursus tristique.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding Panel */}
          <div className="lg:w-1/3 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              
              {/* Payment CTA if winner */}
              {showPaymentButton && (
                <div className="mb-6 bg-green-50 rounded-lg border border-green-200 p-4 text-center">
                  <h3 className="font-bold text-green-800 text-lg mb-2">Congratulations! You won this auction!</h3>
                  <button 
                    onClick={() => router.push(`/auctions/${id}/payment`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {/* Status Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1 uppercase font-semibold">Ends In</p>
                  <p className="text-xl font-bold text-accent">{timeLeft}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-1 uppercase font-semibold">Current Bid</p>
                  <p className="text-2xl font-bold text-primary">${car.currentBid.toLocaleString()}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 bg-[#F8F9FA] p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Left</p>
                  <p className="font-semibold text-sm">{timeLeft.split(' ')[0]} {timeLeft.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Min. Increment</p>
                  <p className="font-semibold text-sm">${car.minIncrement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Lot No.</p>
                  <p className="font-semibold text-sm">#{car.lotNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Odometer</p>
                  <p className="font-semibold text-sm">{car.mileage?.toLocaleString() || '0'} mi</p>
                </div>
              </div>

              {/* Bidding Controls (Only show if active) */}
              {car.status === 'active' && (
                <div className="border-t border-gray-100 pt-6">
                  {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>${(car.currentBid + car.minIncrement).toLocaleString()}</span>
                    <span>${(car.currentBid + car.minIncrement * 10).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <button 
                      onClick={() => setBidAmount(Math.max(car.currentBid + car.minIncrement, bidAmount - car.minIncrement))}
                      className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <div className="flex-1 border-y border-gray-300 h-10 flex items-center justify-center font-bold text-lg">
                      ${bidAmount.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => setBidAmount(bidAmount + car.minIncrement)}
                      className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={handlePlaceBid}
                    className="w-full bg-primary text-white hover:bg-primary-dark font-bold text-lg py-4 rounded-md shadow-md transition-colors"
                  >
                    Submit A Bid
                  </button>
                </div>
              )}
            </div>

            {/* Bidders List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#D3E1F7] py-3 px-6">
                <h3 className="font-bold text-primary flex justify-between">
                  <span>Bidders</span>
                  <span>{car.totalBids}</span>
                </h3>
              </div>
              <div className="p-0 max-h-64 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="p-4 text-center text-gray-500 text-sm">No bids placed yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {bids.map((bid, idx) => (
                      <li key={bid._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-medium w-4">{idx + 1}.</span>
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                            {bid.bidder?.avatar ? (
                                <Image src={bid.bidder.avatar} alt={bid.bidder.username} width={32} height={32} />
                            ) : (
                                bid.bidder?.fullName?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{bid.bidder?.fullName}</p>
                            <p className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">${bid.amount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

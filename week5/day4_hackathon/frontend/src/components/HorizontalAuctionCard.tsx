import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HorizontalAuctionCardProps {
  car: any;
  onBid?: (carId: string) => void;
}

export default function HorizontalAuctionCard({ car, onBid }: HorizontalAuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(car.endTime || Date.now() + 86400000 * 30).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [car.endTime]);

  const imageUrl = car.photos && car.photos.length > 0
    ? (car.photos[0].startsWith('http') ? car.photos[0] : `http://localhost:5000${car.photos[0].startsWith('/') ? '' : '/'}${car.photos[0]}`)
    : '/placeholder-car.jpg';

  return (
    <div className="bg-white p-4 mb-4 flex flex-col md:flex-row gap-6 relative shadow-sm border border-gray-100">
      
      {/* Top Right Star */}
      <div className="absolute top-4 right-4">
        <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 bg-gray-50 transition-colors">
          <Star size={12} className="text-[#3B4C8A]" />
        </button>
      </div>

      {/* Left: Image */}
      <div className="relative w-full md:w-64 h-48 flex-shrink-0 rounded overflow-hidden">
        {car.isTrending && (
          <span className="absolute top-0 left-0 bg-[#E8463A] text-white px-2 py-0.5 text-[10px] font-bold rounded-br z-10 flex items-center">
            Trending <span className="ml-1 text-[8px]">🔥</span>
          </span>
        )}
        <Image
          src={imageUrl}
          alt={car.title || 'Car Image'}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 250px"
          className="object-cover"
        />
      </div>

      {/* Middle: Info */}
      <div className="flex-1 flex flex-col justify-center py-2 pr-4 border-r border-gray-100">
        <h3 className="font-bold text-[#3B4C8A] text-lg mb-1">{car.title || 'Kia Carnival'}</h3>
        
        <div className="flex items-center text-[#F5A623] mb-3 space-x-0.5">
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed pr-4">
          Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis egestas... 
          <a href="#" className="font-bold text-[#3B4C8A] ml-1">View Details</a>
        </p>
      </div>

      {/* Right: Bidding Info */}
      <div className="w-full md:w-[320px] flex flex-col justify-between py-2 pt-8 md:pt-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-bold text-[#3B4C8A] text-sm">${(car.currentBid || car.startingBid || 10709).toLocaleString()}.99</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Current Bid</div>
          </div>
          <div>
            <div className="font-bold text-[#3B4C8A] text-sm">{car.totalBids || 130}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Total Bids</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex text-center text-[11px] font-bold text-[#3B4C8A]">
              <div className="flex flex-col items-center justify-center border border-gray-200 rounded-sm w-7 h-7 mx-0.5">
                {String(timeLeft.days).padStart(2, '0')}
                <span className="text-[7px] font-normal text-gray-400 -mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-200 rounded-sm w-7 h-7 mx-0.5">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="text-[7px] font-normal text-gray-400 -mt-1">Hrs</span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-200 rounded-sm w-7 h-7 mx-0.5">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="text-[7px] font-normal text-gray-400 -mt-1">Min</span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-200 rounded-sm w-7 h-7 mx-0.5">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="text-[7px] font-normal text-gray-400 -mt-1">Sec</span>
              </div>
            </div>
            <div className="text-[9px] text-gray-400 mt-1 pl-1">Time left</div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-bold text-[#3B4C8A] text-[11px]">06:50pm - 03 Jan 2023</div>
            <div className="text-[10px] text-gray-400 mt-0.5">End Time</div>
          </div>
        </div>

        <div>
          <Link 
            href={`/auctions/${car._id}`} 
            className="w-full border border-[#3B4C8A] text-[#3B4C8A] bg-white hover:bg-gray-50 transition-colors py-2 rounded text-xs font-semibold flex items-center justify-center"
          >
            Submit A Bid
          </Link>
        </div>
      </div>
      
    </div>
  );
}

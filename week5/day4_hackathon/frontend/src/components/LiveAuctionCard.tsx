import Image from 'next/image';
import Link from 'next/link';
import { Star, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LiveAuctionCardProps {
  car: any;
  onBid?: (carId: string) => void;
}

export default function LiveAuctionCard({ car, onBid }: LiveAuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(car.endTime).getTime() - new Date().getTime();
      let timeLeftStr = 'Ended';

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        timeLeftStr = `${days}d ${hours}h ${minutes}m left`;
      }
      setTimeLeft(timeLeftStr);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [car.endTime]);

  const imageUrl = car.photos && car.photos.length > 0
    ? (car.photos[0].startsWith('http') ? car.photos[0] : `http://localhost:5000${car.photos[0].startsWith('/') ? '' : '/'}${car.photos[0]}`)
    : '/placeholder-car.jpg';

  return (
    <div className="bg-white rounded overflow-hidden flex flex-col group h-full shadow-lg">
      <div className="p-4 flex-grow flex flex-col relative">
        {/* Top Badges */}
        <div className="absolute top-0 left-0">
          {car.isTrending && (
            <span className="bg-[#E8463A] text-white px-3 py-1 text-[10px] font-bold rounded-br flex items-center">
              Trending <span className="ml-1 text-[8px]">🔥</span>
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Star size={14} className="text-[#3B4C8A]" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center mt-2 mb-6">
          <h3 className="font-bold text-gray-900 text-sm md:text-base">{car.title}</h3>
        </div>

        {/* Image */}
        <div className="relative h-32 w-full mb-6">
          <Image
            src={imageUrl}
            alt={car.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Price & Time info */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="text-left">
            <div className="font-bold text-gray-900 text-sm">${car.currentBid?.toLocaleString() || car.startingBid?.toLocaleString()}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Current Bid</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900 text-sm">{timeLeft.replace(' left', '').replace('d', ' :').replace('h', ' :').replace('m', '')}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Waiting for Bid</div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Link 
            href={`/auctions/${car._id}`} 
            className="w-full bg-[#3B4C8A] text-white hover:bg-[#2A3765] transition-colors py-3 rounded text-sm font-medium flex items-center justify-center"
          >
            Sumbit A Bid
          </Link>
        </div>
      </div>
    </div>
  );
}

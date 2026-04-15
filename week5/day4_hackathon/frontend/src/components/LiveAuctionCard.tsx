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
    ? `http://localhost:5000${car.photos[0]}`
    : '/placeholder-car.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group h-full">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={car.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          {car.isTrending && (
            <span className="bg-accent text-white px-2 py-1 text-xs font-semibold rounded">
              Trending
            </span>
          )}
        </div>
        <button className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-colors">
          <Star size={16} className="text-gray-400 hover:text-secondary" />
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{car.title}</h3>
        </div>
        <div className="flex items-center text-secondary mb-3">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <span className="text-gray-400 text-xs ml-1">(5.0)</span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {car.description || `${car.year} ${car.make} ${car.model}. Mileage: ${car.mileage || 'N/A'}`}
        </p>

        <div className="flex justify-between items-end border-t border-gray-100 pt-3">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Current Bid</span>
            <span className="font-bold text-xl text-primary">${car.currentBid?.toLocaleString() || car.startingBid?.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <Link 
              href={`/auctions/${car._id}`} 
              className="bg-primary text-white hover:bg-primary-dark transition-colors px-4 py-2 rounded-md text-sm font-medium inline-block h-auto leading-normal"
            >
              Submit A Bid
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-2">
            <span>{car.totalBids || 0} Bids</span>
            <span className="font-medium text-accent">{timeLeft} Time</span>
        </div>
      </div>
    </div>
  );
}

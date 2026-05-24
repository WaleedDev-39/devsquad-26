'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/api';
import PageBanner from '@/components/PageBanner';

export default function Payment() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchPaymentStatus();

    const socket = getSocket();
    socket.connect();
    
    if (user?._id) {
       socket.emit('register:user', { userId: user._id });
    }

    // Listen for shipping updates after payment
    socket.on('shipping:update', (data) => {
      if (data.carId === id) {
        setCar((prev: any) => ({
          ...prev,
          paymentStatus: data.status,
          status: data.status === 'delivered' ? 'delivered' : prev?.status
        }));
      }
    });

    return () => {
      socket.off('shipping:update');
    };
  }, [id, user]);

  const fetchPaymentStatus = async () => {
    try {
      const res = await api.get(`/payment/${id}`);
      setCar(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    try {
      await api.post(`/payment/${id}`);
      await fetchPaymentStatus(); // Refresh status
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!car) return <div className="text-center py-20">Car not found</div>;

  return (
    <div>
      <PageBanner 
        title="Make Payments" 
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Auction Listing', path: '/auctions' }, { label: 'Payment' }]} 
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Car Details */}
          <div className="lg:w-2/3">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
               <div className="p-6 border-b">
                 <h2 className="text-2xl font-bold text-gray-800">{car.title}</h2>
                 <p className="text-gray-500 text-sm mt-1">Lot #{car.lotNumber}</p>
               </div>
               <div className="flex flex-col md:flex-row">
                 <div className="md:w-1/3 relative h-48 md:h-auto bg-gray-100">
                    <Image 
                      src={car.photos && car.photos.length > 0 ? `http://localhost:5000${car.photos[0]}` : '/placeholder-car.jpg'} 
                      alt={car.title} 
                      fill 
                      className="object-cover" 
                    />
                 </div>
                 <div className="md:w-2/3 p-6">
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500">VIN Number</p>
                        <p className="font-semibold text-gray-800">{car.vin || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Odometer</p>
                        <p className="font-semibold text-gray-800">{car.mileage?.toLocaleString() || '0'} mi</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="font-semibold text-gray-800">{car.color || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Body Style</p>
                        <p className="font-semibold text-gray-800 uppercase">{car.category}</p>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

             {/* Description Accordion (Design match) */}
             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center cursor-pointer">
                   <h3 className="font-bold text-primary">Winning Bid Description</h3>
                   <span className="text-primary font-bold">+</span>
                </div>
                <div className="p-6 bg-white hidden">
                   {/* Description content here */}
                </div>
             </div>
          </div>

          {/* Right Column - Payment Panel */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-[#D3E1F7] rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-primary font-bold text-xl mb-6">Make Payments</h3>
              
              <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium text-sm">Winning Date</span>
                  <span className="text-gray-800 font-semibold">{new Date(car.endTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium text-sm">Winning End Time</span>
                  <span className="text-gray-800 font-semibold">{new Date(car.endTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium text-sm">Winning Bid</span>
                  <span className="text-gray-800 font-semibold">${car.currentBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-gray-500 font-medium text-sm">Auction Lot No.</span>
                  <span className="text-gray-800 font-semibold">{car.lotNumber}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Pending Amount</span>
                  <span className="text-primary font-bold text-xl">${car.currentBid.toLocaleString()}</span>
                </div>
              </div>

              {car.paymentStatus === 'pending' ? (
                <button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-primary text-white hover:bg-primary-dark font-bold text-lg py-4 rounded-md shadow-md transition-colors"
                >
                  {processing ? 'Processing...' : 'Make Payments'}
                </button>
              ) : (
                <div className="bg-white rounded-lg p-5 text-center shadow-sm">
                  <p className="text-green-600 font-bold mb-2">Payment Completed</p>
                  <p className="text-gray-500 text-sm">Paid on {new Date(car.paymentDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Shipping Progress */}
            {car.paymentStatus !== 'pending' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-6">Shipping Progress</h3>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                         ['shipping', 'in_transit', 'delivered'].includes(car.paymentStatus) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>1</div>
                      <div>
                        <h4 className={`font-bold ${['shipping', 'in_transit', 'delivered'].includes(car.paymentStatus) ? 'text-gray-800' : 'text-gray-400'}`}>Ready For Shipping</h4>
                        <p className="text-sm text-gray-500">Wait Seller Confirm Payment</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                         ['in_transit', 'delivered'].includes(car.paymentStatus) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>2</div>
                      <div>
                        <h4 className={`font-bold ${['in_transit', 'delivered'].includes(car.paymentStatus) ? 'text-gray-800' : 'text-gray-400'}`}>In Transit</h4>
                        <p className="text-sm text-gray-500">Expected: {new Date(car.expectedDeliveryDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                         car.paymentStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>3</div>
                      <div>
                        <h4 className={`font-bold ${car.paymentStatus === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>Delivered</h4>
                        <p className="text-sm text-gray-500">Vehicle Arrived</p>
                      </div>
                    </div>
                  </div>
                </div>

                {car.paymentStatus === 'delivered' && (
                  <div className="mt-8 text-center text-red-500 font-bold bg-red-50 py-3 rounded border border-red-100">
                    Bidding has Ended
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

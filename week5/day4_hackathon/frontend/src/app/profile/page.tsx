'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/slices/authSlice';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import LiveAuctionCard from '@/components/LiveAuctionCard';
import api from '@/lib/api';
import { User, Car, Star, Tag, Settings, Eye } from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const activeTab = searchParams.get('tab') || 'personal';
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [myCars, setMyCars] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (activeTab === 'personal' && !profileData) fetchProfile();
    if (activeTab === 'my-cars' && myCars.length === 0) fetchMyCars();
    if (activeTab === 'my-bids' && myBids.length === 0) fetchMyBids();
    if (activeTab === 'wishlist' && wishlist.length === 0) fetchWishlist();
  }, [activeTab, user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfileData(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchMyCars = async () => {
    try {
      const res = await api.get(`/cars/user/${user?._id}`);
      setMyCars(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchMyBids = async () => {
    try {
      const res = await api.get('/bids/user/me');
      setMyBids(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data);
    } catch (e) { console.error(e); }
  };

  const handleUpdateField = async (fieldCat: string, key: string, value: string) => {
    try {
      if (fieldCat === 'root') {
        const res = await api.patch('/users/me', { [key]: value });
        setProfileData(res.data);
        dispatch(setCredentials({ user: res.data, token: token! }));
      } else if (fieldCat === 'address') {
        const newAddress = { ...profileData.address, [key]: value };
        const res = await api.patch('/users/me/address', newAddress);
        setProfileData(res.data);
      } else if (fieldCat === 'traffic') {
        const newTraffic = { ...profileData.trafficInfo, [key]: value };
        const res = await api.patch('/users/me/traffic-info', newTraffic);
        setProfileData(res.data);
      }
    } catch (e) {
      alert('Failed to update field');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'my-cars', label: 'My Cars List', icon: <Car size={18} /> },
    { id: 'my-bids', label: 'My Bids', icon: <Tag size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Star size={18} /> },
  ];

  if (!user) return null;

  return (
    <div>
      <PageBanner 
        title="My Profile" 
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'My Profile' }]} 
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#D3E1F7] py-6 px-4 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-3 shadow-inner">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.fullName.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-primary">{user.fullName}</h3>
                <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                <div className="mt-3 bg-white text-xs px-3 py-1 text-gray-500 rounded-lg">Verified Account ✓</div>
              </div>

              <div className="flex flex-col">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(`/profile?tab=${tab.id}`)}
                    className={`flex items-center gap-3 px-6 py-4 border-l-4 transition-colors ${
                      activeTab === tab.id 
                        ? 'border-primary bg-gray-50 text-primary font-bold' 
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <button
                   className="flex items-center gap-3 px-6 py-4 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-4"
                >
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Tab: Personal Info */}
            {activeTab === 'personal' && profileData && (
              <div className="space-y-6">
                <InfoCard title="Private Details" fields={[
                  { label: 'Full Name', value: profileData.fullName, cat: 'root', key: 'fullName' },
                  { label: 'Email Address', value: profileData.email, cat: 'root', key: 'email' },
                  { label: 'Mobile Number', value: profileData.mobileNumber || 'Not set', cat: 'root', key: 'mobileNumber' },
                  { label: 'Nationality', value: profileData.nationality || 'Not set', cat: 'root', key: 'nationality' },
                  { label: 'Id Type', value: profileData.idType || 'Passport', cat: 'root', key: 'idType' },
                ]} onUpdate={handleUpdateField} />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                   <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">Password Address</h3>
                   <div className="flex justify-between items-center py-2">
                      <div className="w-1/3 text-gray-500 font-medium">Password</div>
                      <div className="w-1/2 text-gray-800">*************</div>
                      <div className="w-1/6 text-right"><EditButton /></div>
                   </div>
                </div>

                <InfoCard title="Primary Address" fields={[
                  { label: 'Country', value: profileData.address?.country || 'Not set', cat: 'address', key: 'country' },
                  { label: 'City', value: profileData.address?.city || 'Not set', cat: 'address', key: 'city' },
                  { label: 'Address 1', value: profileData.address?.address1 || 'Not set', cat: 'address', key: 'address1' },
                  { label: 'Address 2', value: profileData.address?.address2 || 'Not set', cat: 'address', key: 'address2' },
                  { label: 'Land line number', value: profileData.address?.landLineNumber || 'Not set', cat: 'address', key: 'landLineNumber' },
                ]} onUpdate={handleUpdateField} />
                
                <InfoCard title="Traffic File Info" fields={[
                  { label: 'Type Of Information', value: profileData.trafficInfo?.informationType || 'Not set', cat: 'traffic', key: 'informationType' },
                  { label: 'T.C.F No.', value: profileData.trafficInfo?.fileNumber || 'Not set', cat: 'traffic', key: 'fileNumber' },
                  { label: 'Plate State', value: profileData.trafficInfo?.plateState || 'Not set', cat: 'traffic', key: 'plateState' },
                  { label: 'Plate Code', value: profileData.trafficInfo?.plateCode || 'Not set', cat: 'traffic', key: 'plateCode' },
                  { label: 'Plate Number', value: profileData.trafficInfo?.plateNumber || 'Not set', cat: 'traffic', key: 'plateNumber' },
                ]} onUpdate={handleUpdateField} />
              </div>
            )}

            {/* Tab: My Cars */}
            {activeTab === 'my-cars' && (
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">List Of Bid Hosted By You</h3>
                {myCars.length === 0 ? (
                  <p className="text-gray-500 bg-white p-8 rounded-lg border text-center">You haven't listed any cars yet.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myCars.map((car: any) => (
                      <div key={car._id} className="bg-white rounded-lg shadow-sm border border-gray-100 flex overflow-hidden group">
                        <div className="w-2/5 relative h-full min-h-[140px] bg-gray-100">
                           <Image src={car.photos?.[0] ? `http://localhost:5000${car.photos[0]}` : '/placeholder-car.jpg'} alt="" fill className="object-cover" />
                        </div>
                        <div className="w-3/5 p-4 flex flex-col justify-between">
                           <div>
                             <h4 className="font-bold text-lg mb-1 line-clamp-1">{car.title}</h4>
                             <p className="text-sm font-semibold text-primary mb-2">${car.currentBid.toLocaleString()}</p>
                             <div className="flex justify-between text-xs text-gray-500 mb-2">
                               <span>Lot #{car.lotNumber}</span>
                               <span>{car.totalBids} Bids</span>
                             </div>
                           </div>
                           <div className="flex justify-between items-center mt-2">
                             <span className={`text-xs font-bold px-2 py-1 rounded ${car.status === 'active' ? 'bg-green-100 text-green-700' : car.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                               {car.status.toUpperCase()}
                             </span>
                             <Link href={`/auctions/${car._id}`} className="text-primary hover:underline text-sm font-medium">View</Link>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: My Bids */}
            {activeTab === 'my-bids' && (
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">My Bids</h3>
                {myBids.length === 0 ? (
                  <p className="text-gray-500 bg-white p-8 rounded-lg border text-center">You haven't placed any bids yet.</p>
                ) : (
                  <div className="space-y-4">
                    {myBids.map((bid: any) => (
                      <div key={bid._id} className="bg-white rounded-lg shadow-sm border border-gray-100 flex overflow-hidden">
                        <div className="w-32 relative h-full min-h-[120px] bg-gray-100 hidden sm:block">
                           <Image src={bid.car.photos?.[0] ? `http://localhost:5000${bid.car.photos[0]}` : '/placeholder-car.jpg'} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                           <div>
                             <h4 className="font-bold text-lg mb-1">{bid.car.title}</h4>
                             <p className="text-sm text-gray-500">Lot #{bid.car.lotNumber} • {bid.car.totalBids} Total bids</p>
                           </div>
                           
                           <div className="flex items-center gap-6">
                             <div>
                               <p className="text-xs text-gray-500 uppercase font-semibold">Your Bid</p>
                               <p className="font-bold text-lg text-gray-800">${bid.amount.toLocaleString()}</p>
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 uppercase font-semibold">Current Bid</p>
                               <p className="font-bold text-lg text-primary">${bid.car.currentBid.toLocaleString()}</p>
                             </div>
                           </div>

                           <div>
                             {bid.car.status === 'active' ? (
                               <Link href={`/auctions/${bid.car._id}`} className="block text-center bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md font-medium text-sm transition-colors">
                                 Bid Again
                               </Link>
                             ) : (
                               bid.car.winner === user._id ? (
                                 <Link href={`/auctions/${bid.car._id}/payment`} className="block text-center bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                                   Make Payment
                                 </Link>
                               ) : (
                                 <div className="block text-center bg-gray-200 text-gray-600 px-4 py-2 rounded-md font-medium text-sm cursor-not-allowed">
                                   Ended
                                 </div>
                               )
                             )}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Wishlist</h3>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 bg-white p-8 rounded-lg border text-center">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlist.map((car: any) => (
                      <LiveAuctionCard key={car._id} car={car} />
                    ))}
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

function InfoCard({ title, fields, onUpdate }: { title: string, fields: any[], onUpdate: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">{title}</h3>
      <div className="space-y-4">
        {fields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="w-1/3 text-gray-500 font-medium">{field.label}</div>
            <div className="w-1/2 text-gray-800">{field.value}</div>
            <div className="w-1/6 text-right">
              <EditButton onClick={() => {
                const newVal = prompt(`Enter new value for ${field.label}`, field.value === 'Not set' ? '' : field.value);
                if (newVal !== null && newVal !== field.value) {
                  onUpdate(field.cat, field.key, newVal);
                }
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-gray-400 hover:text-primary transition-colors p-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    </button>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

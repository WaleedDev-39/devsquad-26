import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#3B4C8A] text-white pt-16 pb-6">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between mb-16">
          {/* Logo and Description Column */}
          <div className="w-full md:w-[45%] mb-10 md:mb-0 pr-8">
            <Image src="/logo.png" alt="Car Deposit Logo" width={160} height={42} className="mb-4 object-contain brightness-0 invert" style={{ width: 'auto', height: 'auto' }} />
            <p className="text-[13px] text-gray-300 leading-relaxed font-light">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit
              suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero.
              Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.
            </p>
          </div>

          {/* Links Columns */}
          <div className="w-full md:w-[45%] flex flex-row gap-16 md:gap-32">
            <div>
              <h4 className="font-semibold text-base mb-4">Home</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-4">Car Aucation</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/20 pt-5 mt-4 text-center text-sm text-gray-300 w-full">
        <p className="container mx-auto max-w-6xl px-4"><span className="underline hover:text-white cursor-pointer transition-colors mr-1">Copyright 2022</span> All Rights Reserved</p>
      </div>
    </footer>
  );
}

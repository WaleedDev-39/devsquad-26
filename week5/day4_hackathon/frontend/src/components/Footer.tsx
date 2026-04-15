import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <Image src="/logo.png" alt="Car Deposit Logo" width={180} height={48} className="mb-6 object-contain brightness-0 invert" />
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis pmn turpis pretium donec orci semper. Sit
              suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero.
              Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas tristique et lectus viverra in sed mauris.
            </p>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-primary-dark border border-gray-500 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-dark border border-gray-500 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-dark border border-gray-500 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-dark border border-gray-500 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-6">Home</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/help" className="hover:text-secondary transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-6">Car Aucation</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/help" className="hover:text-secondary transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
              <li><Link href="/profile" className="hover:text-secondary transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-6">About us</h4>
            <ul className="space-y-6 text-sm text-gray-300">
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full border border-gray-400 p-1">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="font-semibold">Hot Line Number</p>
                  <p>+054 211 4444</p>
                </div>
              </li>
              <li className="flex items-start relative before:absolute before:left-[11px] before:-top-6 before:h-5 before:w-px before:bg-gray-400">
                <div className="mt-1 mr-3 rounded-full border border-gray-400 p-1 bg-primary relative z-10">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-semibold">Email Id :</p>
                  <a href="mailto:info@cardeposit.com" className="underline hover:text-secondary transition-colors">info@cardeposit.com</a>
                </div>
              </li>
              <li className="flex items-start relative before:absolute before:left-[11px] before:-top-6 before:h-5 before:w-px before:bg-gray-400">
                <div className="mt-1 mr-3 rounded-full border border-gray-400 p-1 bg-primary relative z-10">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="leading-tight">Office No 6, SKB Plaza next to Bentley showroom, Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-600 pt-6 mt-8 text-center text-sm text-gray-300">
        <p><span className="underline decoration-1 underline-offset-2 hover:text-white cursor-pointer transition-colors">Copyright 2022</span> All Rights Reserved</p>
      </div>
    </footer>
  );
}

import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="bg-[#3B4C8A] text-white py-2 px-4 text-sm font-light">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <span>Call Us</span>
            <a href="tel:570-694-4002" className="hover:text-secondary transition-colors">
              570-694-4002
            </a> 
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>
            Email Id :{' '}
            <a href="mailto:info@cardeposit.com" className="hover:text-secondary transition-colors underline">
              info@cardeposit.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

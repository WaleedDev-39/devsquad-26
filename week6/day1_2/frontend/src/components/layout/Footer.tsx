'use client';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Github, Mail, MailIcon } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About', href: '#' },
    { label: 'Features', href: '#' },
    { label: 'Works', href: '#' },
    { label: 'Career', href: '#' },
  ],
  help: [
    { label: 'Customer Support', href: '#' },
    { label: 'Delivery Details', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  faq: [
    { label: 'Account', href: '/profile' },
    { label: 'Manage Deliveries', href: '#' },
    { label: 'Orders', href: '/profile' },
    { label: 'Payments', href: '#' },
  ],
  resources: [
    { label: 'Free eBooks', href: '#' },
    { label: 'Development Tutorial', href: '#' },
    { label: 'How to - Blog', href: '#' },
    { label: 'Youtube Playlist', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] mt-16">
      {/* Newsletter Banner */}
      <div className="bg-black mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 -mb-0 relative -top-8">
        <h2 className="font-integral text-2xl sm:text-3xl lg:text-4xl text-white max-w-sm sm:max-w-md leading-tight">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <div className="flex flex-col gap-3 w-full sm:w-auto min-w-[280px]">
          <div className="flex items-center bg-white rounded-full px-4 py-3 gap-3">
            <Mail color='gray' size={18}/>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            />
          </div>
          <button className="w-full bg-white text-black font-medium text-sm py-3 rounded-full hover:bg-gray-100 transition-colors">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/">
              <span><img src="/logo.png" alt="logo" /></span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-[200px]">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[Twitter, Facebook, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {(['company', 'help', 'faq', 'resources'] as const).map((section) => (
            <div key={section}>
              <h3 className="font-bold text-xs tracking-widest uppercase mb-4">
                {section === 'faq' ? 'FAQ' : section.charAt(0).toUpperCase() + section.slice(1)}
              </h3>
              <ul className="space-y-2.5">
                {footerLinks[section].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-black transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">Shop.co © 2000-2023, All Rights Reserved</p>
          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {['/assets/visa-pay.png', '/assets/master-pay.png', '/assets/paypal-pay.png', '/assets/apple-pay.png', '/assets/google-pay.png'].map((p) => (
              <img key={p} className="flex items-center justify-center cursor-pointer" src={p} alt={p} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

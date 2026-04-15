'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import MobileMenu from './MobileMenu';

const shopCategories = [
  { label: 'T-Shirts', href: '/shop?category=T-shirts' },
  { label: 'Shorts', href: '/shop?category=Shorts' },
  { label: 'Shirts', href: '/shop?category=Shirts' },
  { label: 'Hoodies', href: '/shop?category=Hoodies' },
  { label: 'Jeans', href: '/shop?category=Jeans' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropOpen, setShopDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShopDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-integral text-xl sm:text-2xl tracking-tight font-black"><img src="./logo.png" alt="logo" /></span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6 ml-6">
            {/* Shop dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                className="flex items-center gap-1 text-sm font-medium hover:text-gray-600 transition-colors"
                onClick={() => setShopDropOpen((p) => !p)}
              >
                Shop <ChevronDown size={16} className={`transition-transform ${shopDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopDropOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {shopCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setShopDropOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/shop"
                      className="block px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      onClick={() => setShopDropOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/shop?sort=sale" className="text-sm font-medium hover:text-gray-600 transition-colors">
              On Sale
            </Link>
            <Link href="/shop?arrivals=true" className="text-sm font-medium hover:text-gray-600 transition-colors">
              New Arrivals
            </Link>
            <Link href="/shop?brand=true" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Brands
            </Link>
          </div>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-4 items-center bg-brand-gray rounded-full px-4 py-2 gap-2"
          >
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </form>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Search — mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <Link href="/profile" className="p-2 rounded-lg hover:bg-gray-100 flex items-center gap-1.5">
                <User size={20} />
                <span className="hidden sm:block text-sm font-medium truncate max-w-[80px]">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link href="/auth/login" className="p-2 rounded-lg hover:bg-gray-100">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-brand-gray rounded-full px-4 py-2 gap-2"
            >
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search for products..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={16} className="text-gray-400" />
              </button>
            </form>
          </div>
        )}
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} categories={shopCategories} />
    </>
  );
}

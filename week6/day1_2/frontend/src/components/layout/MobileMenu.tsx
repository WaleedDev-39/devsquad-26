'use client';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: { label: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, categories }: Props) {
  const { isLoggedIn, logout } = useAuthStore();
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white z-50 flex flex-col shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-integral text-lg font-black">SHOP.CO</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">Shop</p>
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={onClose}
              className="flex items-center justify-between px-2 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              {cat.label}
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
            <Link href="/shop?sort=sale" onClick={onClose} className="flex items-center justify-between px-2 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
              On Sale <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link href="/shop?arrivals=true" onClick={onClose} className="flex items-center justify-between px-2 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
              New Arrivals <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link href="/shop" onClick={onClose} className="flex items-center justify-between px-2 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
              All Products <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t space-y-2">
          {isLoggedIn ? (
            <>
              <Link href="/profile" onClick={onClose} className="block w-full text-center py-2.5 border border-black rounded-full text-sm font-medium hover:bg-gray-50">
                My Profile
              </Link>
              <button
                onClick={() => { logout(); onClose(); }}
                className="block w-full text-center py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={onClose} className="block w-full text-center py-2.5 border border-black rounded-full text-sm font-medium hover:bg-gray-50">
                Sign In
              </Link>
              <Link href="/auth/register" onClick={onClose} className="block w-full text-center py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const adminNavItems = [
  { label: 'DASHBOARD', href: '/admin', icon: LayoutDashboard },
  { label: 'ALL PRODUCTS', href: '/admin/products', icon: Package },
  { label: 'ORDER LIST', href: '/admin/orders', icon: ShoppingBag },
  { label: 'USERS', href: '/admin/users', icon: Users },
];

const superAdminNavItems = [
  { label: 'MANAGE ADMINS', href: '/admin/admin-management', icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'superadmin';

  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href) && href !== '/admin');

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200 min-h-screen hidden lg:flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-8 pb-6 flex items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-4xl text-[#0b1f52] italic tracking-tight">
              Arik
            </span>
            <div className="w-10 h-10 bg-[#0b1f52] rounded-full flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current absolute right-0">
                <path d="M0,50 Q25,0 50,50 T100,50 L100,0 L0,0 Z"></path>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-6 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          isSuperAdmin
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {isSuperAdmin ? <ShieldCheck size={12} /> : <Users size={12} />}
          {isSuperAdmin ? 'Super Admin' : 'Admin'}
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {/* Main nav items */}
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Main Menu
        </p>
        {adminNavItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold tracking-wide ${
                active
                  ? 'bg-[#003B73] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon
                size={18}
                className={active ? 'text-white' : 'text-gray-400'}
                strokeWidth={active ? 2.5 : 2}
              />
              {label}
            </Link>
          );
        })}

        {/* Super Admin only section */}
        {isSuperAdmin && (
          <>
            <p className="px-3 pt-5 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Super Admin
            </p>
            {superAdminNavItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold tracking-wide ${
                    active
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? 'text-white' : 'text-purple-400'}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}

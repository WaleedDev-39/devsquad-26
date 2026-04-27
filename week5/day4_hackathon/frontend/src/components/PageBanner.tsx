import Link from 'next/link';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; path?: string }[];
}

export default function PageBanner({ title, subtitle, breadcrumbs }: PageBannerProps) {
  return (
    <div className="bg-[#D3E1F7] py-12 flex flex-col items-center justify-center border-b border-gray-200">
      <h1 className="text-5xl font-bold text-primary mb-2 tracking-wide font-sans">{title}</h1>
      {/* Decorative underline */}
      <div className="w-16 h-1 bg-primary mb-6"></div>
      
      {subtitle && <p className="text-gray-600 mb-6 text-center max-w-lg">{subtitle}</p>}
      
      <nav className="text-[13px] font-medium text-gray-700 flex items-center space-x-2 bg-[#B7CDEF] px-6 py-1.5 rounded-full">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-500">{'>'}</span>}
            {crumb.path ? (
              <Link href={crumb.path} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-primary">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

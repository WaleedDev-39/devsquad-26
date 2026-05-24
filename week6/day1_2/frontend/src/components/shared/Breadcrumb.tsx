import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb { label: string; href?: string; }
interface Props { crumbs: Crumb[]; }

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
      {crumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-black transition-colors">{crumb.label}</Link>
          ) : (
            <span className="text-black font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

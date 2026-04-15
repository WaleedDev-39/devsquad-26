'use client';
import { useState } from 'react';
import { FilterState } from '@/types';
import { cn } from '@/lib/utils';

const COLORS = ['#00B300','#FF0000','#FFFF00','#FF6B00','#00BFFF','#0000CD','#8B00FF','#FF69B4','#FFFFFF','#000000'];
const SIZES = ['XX-Small','X-Small','Small','Medium','Large','X-Large','XX-Large','3X-Large','4X-Large'];
const DRESS_STYLES = ['Casual','Formal','Party','Gym'];
const CATEGORIES = ['T-shirts','Shorts','Shirts','Hoodie','Jeans'];

interface Props {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export default function FiltersSidebar({ filters, onFiltersChange }: Props) {
  const [local, setLocal] = useState<FilterState>({ ...filters, minPrice: filters.minPrice || 50, maxPrice: filters.maxPrice || 200 });

  const apply = () => onFiltersChange({ ...local, page: 1 });
  const reset = () => { const f = { page: 1 }; setLocal({ minPrice: 50, maxPrice: 200, page: 1 }); onFiltersChange(f); };

  return (
    <div className="border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Filters</h3>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-black transition-colors">Reset all</button>
      </div>

      {/* Categories */}
      <div className="mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setLocal((l) => ({ ...l, category: l.category === cat ? undefined : cat }))}
            className={cn('flex items-center justify-between w-full py-2 text-sm hover:text-gray-600', local.category === cat && 'font-bold')}
          >
            {cat}
            <span className="text-gray-400">›</span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <p className="font-bold text-sm mb-4">Price</p>
        <div className="flex gap-2">
          <input type="number" min={0} max={local.maxPrice} value={local.minPrice} onChange={e => setLocal(l => ({...l, minPrice: +e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black" placeholder="Min" />
          <input type="number" min={local.minPrice} max={5000} value={local.maxPrice} onChange={e => setLocal(l => ({...l, maxPrice: +e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black" placeholder="Max" />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>${local.minPrice}</span><span>${local.maxPrice}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <p className="font-bold text-sm mb-3">Colors</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setLocal((l) => ({ ...l, color: l.color === c ? undefined : c }))}
              style={{ backgroundColor: c }}
              className={cn('w-8 h-8 rounded-full border-2 transition-all', local.color === c ? 'border-black scale-110 shadow-md' : 'border-transparent hover:border-gray-400', c === '#FFFFFF' && 'border-gray-300')}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <p className="font-bold text-sm mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setLocal((l) => ({ ...l, size: l.size === s ? undefined : s }))}
              className={cn('px-3 py-1.5 rounded-full text-xs border transition-all', local.size === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-400')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-5">
        <p className="font-bold text-sm mb-3">Dress Style</p>
        {DRESS_STYLES.map((ds) => (
          <button
            key={ds}
            onClick={() => setLocal((l) => ({ ...l, style: l.style === ds ? undefined : ds }))}
            className={cn('flex items-center justify-between w-full py-2 text-sm hover:text-gray-600', local.style === ds && 'font-bold')}
          >
            {ds}
            <span className="text-gray-400">›</span>
          </button>
        ))}
      </div>

      <button onClick={apply} className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
        Apply Filter
      </button>
    </div>
  );
}

'use client';
import { X } from 'lucide-react';
import { FilterState } from '@/types';
import FiltersSidebar from './FiltersSidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export default function FiltersDrawer({ isOpen, onClose, filters, onFiltersChange }: Props) {
  if (!isOpen) return null;
  return (
    <>
      <div className="filter-overlay" onClick={onClose} />
      <div className="filter-drawer p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Filters</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <FiltersSidebar
          filters={filters}
          onFiltersChange={(f) => { onFiltersChange(f); onClose(); }}
        />
      </div>
    </>
  );
}

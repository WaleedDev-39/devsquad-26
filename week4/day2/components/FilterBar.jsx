'use client';

import useFilterStore from '@/store/useFilterStore';
import FilterTag from './FilterTag';

export default function FilterBar() {
  const { filters, removeFilter, clearFilters } = useFilterStore();

  if (filters.length === 0) return null;

  return (
    <div className="bg-card rounded-md shadow-card p-5 md:px-10 flex justify-between items-center z-10 w-full animate-in fade-in zoom-in duration-300">
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <FilterTag
            key={filter}
            text={filter}
            isRemovable
            onRemove={() => removeFilter(filter)}
          />
        ))}
      </div>
      <button
        onClick={clearFilters}
        className="font-bold text-neutral-dark hover:text-primary hover:underline transition-colors text-sm cursor-pointer ml-4"
      >
        Clear
      </button>
    </div>
  );
}

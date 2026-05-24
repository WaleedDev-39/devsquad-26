import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFilterStore = create(
  persist(
    (set) => ({
      filters: [],
      addFilter: (tag) =>
        set((state) => ({
          filters: state.filters.includes(tag)
            ? state.filters
            : [...state.filters, tag],
        })),
      removeFilter: (tag) =>
        set((state) => ({
          filters: state.filters.filter((f) => f !== tag),
        })),
      clearFilters: () => set({ filters: [] }),
    }),
    {
      name: 'job-filters-storage',
    }
  )
);

export default useFilterStore;

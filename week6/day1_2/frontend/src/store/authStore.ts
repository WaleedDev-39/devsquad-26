import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('shopco_token', token);
        }
        set({ user, token, isLoggedIn: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('shopco_token');
        }
        set({ user: null, token: null, isLoggedIn: false });
      },

      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    { name: 'shopco-auth', partialize: (s) => ({ user: s.user, token: s.token, isLoggedIn: s.isLoggedIn }) },
  ),
);

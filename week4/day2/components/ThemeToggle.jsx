'use client';

import { useEffect, useState } from 'react';
import useThemeStore from '@/store/useThemeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply theme to document element for Tailwind dark mode if needed
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-8 right-6 md:right-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 text-sm border border-white/30 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}

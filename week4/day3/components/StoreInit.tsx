"use client";

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function StoreInit() {
  const fetchGames = useGameStore((state) => state.fetchGames);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchGames();
    }
  }, [fetchGames]);

  return null;
}

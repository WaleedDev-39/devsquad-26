import { create } from 'zustand';

// Types deduced from data.json
export interface SwiperCard {
  id: string;
  image: string;
  name: string;
  discount: string;
  actualPrice: string;
  discountedPrice: string;
}

export interface PremiumGame {
  id: string;
  image: string;
  name: string;
  desc: string;
  price: string;
}

export interface FreeGame {
  id: string;
  image: string;
  name: string;
  desc: string;
}

export interface StandardGame {
  id: string;
  image: string;
  name: string;
  price: string;
}

export interface GameState {
  swiperCards: SwiperCard[];
  premiumGames: PremiumGame[];
  freeGames: FreeGame[];
  topGames: StandardGame[];
  bestGames: StandardGame[];
  upcomingGames: StandardGame[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  swiperCards: [],
  premiumGames: [],
  freeGames: [],
  topGames: [],
  bestGames: [],
  upcomingGames: [],
  isLoading: true,
  error: null,
  
  fetchGames: async () => {
    try {
      set({ isLoading: true, error: null });
      // In Next.js, files in public/ are served from the root path
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Artificial delay to simulate network latency for user wow effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({
        swiperCards: data.SwiperData?.swiperCards || [],
        premiumGames: data.PremiumData?.premiumGames || [],
        freeGames: data.FreeGamesData?.CardsData || [],
        topGames: data.TopGames?.Data || [],
        bestGames: data.BestGames?.Data || [],
        upcomingGames: data.UpcomingGames?.Data || [],
        isLoading: false
      });
    } catch (error: any) {
      console.error('Error fetching game data:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));

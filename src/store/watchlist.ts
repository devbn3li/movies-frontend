import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Movie, TVShow } from "@/types";

// Define watchlist item type
export type WatchlistItem = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_url: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  addedAt: string;
};

interface WatchlistState {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Movie | TVShow, type: "movie" | "tv") => void;
  removeFromWatchlist: (id: number, type: "movie" | "tv") => void;
  isInWatchlist: (id: number, type: "movie" | "tv") => boolean;
  clearWatchlist: () => void;
  getWatchlistCount: () => number;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],

      addToWatchlist: (item: Movie | TVShow, type: "movie" | "tv") => {
        const watchlistItem: WatchlistItem = {
          id: item.id,
          type,
          title:
            type === "movie" ? (item as Movie).title : (item as TVShow).name,
          poster_url: item.poster_url,
          release_date:
            type === "movie" ? (item as Movie).release_date : undefined,
          first_air_date:
            type === "tv" ? (item as TVShow).first_air_date : undefined,
          vote_average: item.vote_average,
          addedAt: new Date().toISOString(),
        };

        set((state) => {
          // Check if item already exists
          const exists = state.watchlist.some(
            (existing) => existing.id === item.id && existing.type === type
          );

          if (!exists) {
            return {
              watchlist: [watchlistItem, ...state.watchlist],
            };
          }
          return state;
        });
      },

      removeFromWatchlist: (id: number, type: "movie" | "tv") => {
        set((state) => ({
          watchlist: state.watchlist.filter(
            (item) => !(item.id === id && item.type === type)
          ),
        }));
      },

      isInWatchlist: (id: number, type: "movie" | "tv") => {
        const state = get();
        return state.watchlist.some(
          (item) => item.id === id && item.type === type
        );
      },

      clearWatchlist: () => {
        set({ watchlist: [] });
      },

      getWatchlistCount: () => {
        const state = get();
        return state.watchlist.length;
      },
    }),
    {
      name: "movies-watchlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

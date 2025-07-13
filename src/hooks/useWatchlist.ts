import { useWatchlistStore } from "@/store/watchlist";
import { Movie, TVShow } from "@/types";

export const useWatchlist = () => {
  const store = useWatchlistStore();

  return {
    ...store,
    addMovie: (movie: Movie) => store.addToWatchlist(movie, "movie"),
    addTVShow: (tvShow: TVShow) => store.addToWatchlist(tvShow, "tv"),
    removeMovie: (movieId: number) =>
      store.removeFromWatchlist(movieId, "movie"),
    removeTVShow: (tvShowId: number) =>
      store.removeFromWatchlist(tvShowId, "tv"),
    isMovieInWatchlist: (movieId: number) =>
      store.isInWatchlist(movieId, "movie"),
    isTVShowInWatchlist: (tvShowId: number) =>
      store.isInWatchlist(tvShowId, "tv"),
  };
};

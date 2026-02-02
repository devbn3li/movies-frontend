import axios from "./axios";
import {
  Video,
  VideosResponse,
  Review,
  ReviewInput,
  ReviewResponse,
  ReviewStats,
  ReviewUpdateInput,
} from "@/types/index";

// TMDB Types
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  video: boolean;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  origin_country: string[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

// Helper function to get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getAllMovies = async () => {
  const res = await axios.get("/movies");
  return res.data;
};

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
// API URL for backend (separate from frontend base URL)
const MOVIE_ZONE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://movies-api-theta-weld.vercel.app/api";

const tmdbHeaders = {
  accept: "application/json",
  Authorization: `Bearer ${TMDB_API_KEY}`,
};

export const getMovieCredits = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie credits: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null;
  }
};

export const getTVCredits = async (tvId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/credits?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV credits: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV credits:", error);
    return null;
  }
};

export const getCredits = async (id: number, mediaType: "movie" | "tv") => {
  if (mediaType === "movie") {
    return await getMovieCredits(id);
  } else {
    return await getTVCredits(id);
  }
};

// TV Series API functions
export const getTVSeriesDetails = async (seriesId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${seriesId}?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV series details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV series details:", error);
    return null;
  }
};

// Person/Actor API functions
export const getPersonDetails = async (personId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      // Don't log 404 errors (person not found is expected sometimes)
      if (response.status !== 404) {
        console.error(`Failed to fetch person details: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person details:", error);
    return null;
  }
};

export const getPersonMovieCredits = async (personId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/movie_credits?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to fetch person movie credits: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person movie credits:", error);
    return null;
  }
};

export const getPersonTVCredits = async (personId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/tv_credits?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to fetch person TV credits: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person TV credits:", error);
    return null;
  }
};

export const getPersonImages = async (personId: number) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/person/${personId}/images`, {
      method: "GET",
      headers: tmdbHeaders,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to fetch person images: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person images:", error);
    return null;
  }
};

export const getPersonExternalIds = async (personId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/external_ids`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to fetch person external IDs: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person external IDs:", error);
    return null;
  }
};

// Trailer/Videos API functions
export const getMovieVideos = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie videos: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};

export const getTVVideos = async (tvId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/videos?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV videos: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV videos:", error);
    return null;
  }
};

export const getVideos = async (id: number, mediaType: "movie" | "tv") => {
  if (mediaType === "movie") {
    return await getMovieVideos(id);
  } else {
    return await getTVVideos(id);
  }
};

// Helper function to get the main trailer from videos
export const getMainTrailer = (videos: VideosResponse) => {
  if (!videos || !videos.results || videos.results.length === 0) {
    return null;
  }

  const officialTrailer = videos.results.find(
    (video: Video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      (video.name.toLowerCase().includes("official") ||
        video.name.toLowerCase().includes("main") ||
        video.name.toLowerCase().includes("final"))
  );

  if (officialTrailer) {
    return officialTrailer;
  }

  const anyTrailer = videos.results.find(
    (video: Video) => video.type === "Trailer" && video.site === "YouTube"
  );

  if (anyTrailer) {
    return anyTrailer;
  }

  const anyYouTubeVideo = videos.results.find(
    (video: Video) => video.site === "YouTube"
  );

  return anyYouTubeVideo || null;
};

// Cache for genres to avoid multiple API calls
let movieGenresCache: TMDBGenre[] | null = null;
let tvGenresCache: TMDBGenre[] | null = null;

// Helper function to get genre names from genre IDs
const getGenreNames = (genreIds: number[], genres: TMDBGenre[]): string[] => {
  return genreIds
    .map(id => genres.find(g => g.id === id)?.name)
    .filter((name): name is string => !!name);
};

// Helper to convert TMDB movie to local format
const convertTMDBMovieToLocal = (movie: TMDBMovie, genres: TMDBGenre[]) => ({
  id: movie.id,
  title: movie.title,
  original_title: movie.original_title,
  overview: movie.overview,
  release_date: movie.release_date,
  genre_names: getGenreNames(movie.genre_ids, genres),
  poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
  backdrop_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null,
  popularity: movie.popularity,
  vote_average: movie.vote_average,
  vote_count: movie.vote_count,
  original_language: movie.original_language,
  video: movie.video,
});

// Helper to convert TMDB TV show to local format
const convertTMDBTVShowToLocal = (show: TMDBTVShow, genres: TMDBGenre[]) => ({
  id: show.id,
  name: show.name,
  original_name: show.original_name,
  overview: show.overview,
  first_air_date: show.first_air_date,
  genre_names: getGenreNames(show.genre_ids, genres),
  poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
  backdrop_url: show.backdrop_path ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}` : null,
  popularity: show.popularity,
  vote_average: show.vote_average,
  vote_count: show.vote_count,
  original_language: show.original_language,
  origin_country: show.origin_country,
});

// Get movie genres from TMDB
export const getMovieGenres = async (): Promise<TMDBGenre[]> => {
  try {
    if (movieGenresCache) return movieGenresCache;

    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie genres: ${response.status}`);
    }

    const data = await response.json();
    movieGenresCache = data.genres;
    return data.genres;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
};

// Get TV show genres from TMDB
export const getTVGenres = async (): Promise<TMDBGenre[]> => {
  try {
    if (tvGenresCache) return tvGenresCache;

    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?language=en-US`,
      {
        method: "GET",
        headers: tmdbHeaders,
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV genres: ${response.status}`);
    }

    const data = await response.json();
    tvGenresCache = data.genres;
    return data.genres;
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
};

// Generate years dynamically (current year to 1950)
export const getMovieYears = async (): Promise<string[]> => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year.toString());
  }
  return years;
};

export const getTVYears = async (): Promise<string[]> => {
  return getMovieYears(); // Same logic for TV shows
};

// Get movies from TMDB
export const getMovies = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  year?: number;
  sort_by?: string;
  order?: string;
  min_rating?: number;
  max_rating?: number;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
}) => {
  try {
    const genres = await getMovieGenres();
    const page = params?.page || 1;

    let url: string;
    
    // Use search endpoint if search param is provided
    if (params?.search) {
      url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(params.search)}&page=${page}&language=en-US`;
    } else {
      // Use discover endpoint for filtering
      const urlParams = new URLSearchParams({
        language: "en-US",
        page: page.toString(),
        include_adult: "false",
      });

      // Sort by
      if (params?.sort_by) {
        let tmdbSortBy = "popularity.desc";
        switch (params.sort_by) {
          case "title":
            tmdbSortBy = params.order === "desc" ? "title.desc" : "title.asc";
            break;
          case "release_date":
            tmdbSortBy = params.order === "desc" ? "primary_release_date.desc" : "primary_release_date.asc";
            break;
          case "vote_average":
            tmdbSortBy = params.order === "desc" ? "vote_average.desc" : "vote_average.asc";
            break;
          case "popularity":
            tmdbSortBy = params.order === "desc" ? "popularity.desc" : "popularity.asc";
            break;
        }
        urlParams.set("sort_by", tmdbSortBy);
      } else {
        urlParams.set("sort_by", "popularity.desc");
      }

      // Genre filter
      if (params?.genre && params.genre !== "all") {
        const genreObj = genres.find(g => g.name.toLowerCase() === params.genre?.toLowerCase());
        if (genreObj) {
          urlParams.set("with_genres", genreObj.id.toString());
        }
      }

      // Year filter
      if (params?.year) {
        urlParams.set("primary_release_year", params.year.toString());
      }

      // Min rating filter
      if (params?.min_rating) {
        urlParams.set("vote_average.gte", params.min_rating.toString());
      }

      url = `${TMDB_BASE_URL}/discover/movie?${urlParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: tmdbHeaders,
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }

    const data = await response.json();
    const movies = data.results.map((movie: TMDBMovie) => convertTMDBMovieToLocal(movie, genres));

    return {
      movies,
      content: movies,
      totalMovies: data.total_results,
      totalPages: data.total_pages,
      currentPage: data.page,
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

// Get TV shows from TMDB
export const getTVShows = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  year?: number;
  sort_by?: string;
  order?: string;
  min_rating?: number;
  max_rating?: number;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
  country?: string;
}) => {
  try {
    const genres = await getTVGenres();
    const page = params?.page || 1;

    let url: string;
    
    // Use search endpoint if search param is provided
    if (params?.search) {
      url = `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(params.search)}&page=${page}&language=en-US`;
    } else {
      // Use discover endpoint for filtering
      const urlParams = new URLSearchParams({
        language: "en-US",
        page: page.toString(),
        include_adult: "false",
      });

      // Sort by
      if (params?.sort_by) {
        let tmdbSortBy = "popularity.desc";
        switch (params.sort_by) {
          case "name":
            tmdbSortBy = params.order === "desc" ? "name.desc" : "name.asc";
            break;
          case "first_air_date":
            tmdbSortBy = params.order === "desc" ? "first_air_date.desc" : "first_air_date.asc";
            break;
          case "vote_average":
            tmdbSortBy = params.order === "desc" ? "vote_average.desc" : "vote_average.asc";
            break;
          case "popularity":
            tmdbSortBy = params.order === "desc" ? "popularity.desc" : "popularity.asc";
            break;
        }
        urlParams.set("sort_by", tmdbSortBy);
      } else {
        urlParams.set("sort_by", "popularity.desc");
      }

      // Genre filter
      if (params?.genre && params.genre !== "all") {
        const genreObj = genres.find(g => g.name.toLowerCase() === params.genre?.toLowerCase());
        if (genreObj) {
          urlParams.set("with_genres", genreObj.id.toString());
        }
      }

      // Year filter
      if (params?.year) {
        urlParams.set("first_air_date_year", params.year.toString());
      }

      // Min rating filter
      if (params?.min_rating) {
        urlParams.set("vote_average.gte", params.min_rating.toString());
      }

      url = `${TMDB_BASE_URL}/discover/tv?${urlParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: tmdbHeaders,
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.status}`);
    }

    const data = await response.json();
    const tvShows = data.results.map((show: TMDBTVShow) => convertTMDBTVShowToLocal(show, genres));

    return {
      tvShows,
      content: tvShows,
      totalShows: data.total_results,
      totalPages: data.total_pages,
      currentPage: data.page,
    };
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return null;
  }
};

// Get all content (movies + TV shows) from TMDB
export const getAllContent = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  year?: number;
  sort_by?: string;
  order?: string;
  min_rating?: number;
  max_rating?: number;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
  country?: string;
  type?: "movie" | "tv";
}) => {
  try {
    // Extract type and country, pass remaining params
    const { type, country, ...baseParams } = params || {};
    
    if (type === "movie") {
      const result = await getMovies(baseParams);
      return result;
    } else if (type === "tv") {
      const result = await getTVShows({ ...baseParams, country });
      return result;
    }

    // If no type specified, fetch both and combine
    const [moviesResult, tvShowsResult] = await Promise.all([
      getMovies({ ...baseParams, page: 1 }),
      getTVShows({ ...baseParams, country, page: 1 }),
    ]);

    const movies = moviesResult?.content || [];
    const tvShows = tvShowsResult?.content || [];

    // Combine and sort by popularity
    const combined = [...movies, ...tvShows].sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    return {
      content: combined,
      movies,
      tvShows,
      totalResults: (moviesResult?.totalMovies || 0) + (tvShowsResult?.totalShows || 0),
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};


// Reviews API functions
export const getMovieReviews = async (movieId: string): Promise<Review[]> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`/reviews/${movieId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
};

export const getSeriesReviews = async (seriesId: string): Promise<Review[]> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`/reviews/${seriesId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching series reviews:", error);
    return [];
  }
};

export const addMovieReview = async (
  movieId: string,
  reviewData: ReviewInput
): Promise<ReviewResponse> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`/reviews/${movieId}`, reviewData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie review:", error);
    throw error;
  }
};

export const addSeriesReview = async (
  seriesId: string,
  reviewData: ReviewInput
): Promise<ReviewResponse> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`/reviews/${seriesId}`, reviewData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding series review:", error);
    throw error;
  }
};

export const updateReview = async (
  movieId: string,
  reviewData: ReviewUpdateInput
): Promise<ReviewResponse> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(`/reviews/${movieId}`, reviewData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (
  movieId: string
): Promise<{ message: string }> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.delete(`/reviews/${movieId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getReviewStats = async (movieId: string): Promise<ReviewStats> => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`/reviews/${movieId}/stats`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {},
    };
  }
};

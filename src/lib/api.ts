import axios from "./axios";
import { Video, VideosResponse } from "@/types/index";

export const getAllMovies = async () => {
  const res = await axios.get("/movies");
  return res.data;
};

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MOVIE_ZONE_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch person details: ${response.status}`);
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
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch person movie credits: ${response.status}`
      );
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
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch person TV credits: ${response.status}`);
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
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch person images: ${response.status}`);
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
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch person external IDs: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person external IDs:", error);
    return null;
  }
};

// Watch Providers API functions
export const getMovieWatchProviders = async (movieId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/watch/providers`,
      {
        method: "GET",
        headers: tmdbHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch movie watch providers: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie watch providers:", error);
    return null;
  }
};

export const getTVWatchProviders = async (tvId: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/watch/providers`,
      {
        method: "GET",
        headers: tmdbHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch TV watch providers: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV watch providers:", error);
    return null;
  }
};

export const getWatchProviders = async (
  id: number,
  mediaType: "movie" | "tv"
) => {
  if (mediaType === "movie") {
    return await getMovieWatchProviders(id);
  } else {
    return await getTVWatchProviders(id);
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
  adult?: boolean;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
}) => {
  try {
    const url = new URL(`${MOVIE_ZONE_BASE_URL}/movies-only`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    // Get token from localStorage for client-side requests
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const headers: Record<string, string> = {
      accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

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
  adult?: boolean;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
  country?: string;
}) => {
  try {
    const url = new URL(`${MOVIE_ZONE_BASE_URL}/tvshows-only`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    // Get token from localStorage for client-side requests
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const headers: Record<string, string> = {
      accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return null;
  }
};

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
  adult?: boolean;
  language?: string;
  original_language?: string;
  min_popularity?: number;
  min_votes?: number;
  country?: string;
  type?: "movie" | "tv";
}) => {
  try {
    const url = new URL(`${MOVIE_ZONE_BASE_URL}/movies`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    // Get token from localStorage for client-side requests
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const headers: Record<string, string> = {
      accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};

// Get movie genres from TMDB
export const getMovieGenres = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?language=en`,
      {
        method: "GET",
        headers: tmdbHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie genres: ${response.status}`);
    }

    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
};

// Get TV show genres from TMDB
export const getTVGenres = async () => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/genre/tv/list?language=en`, {
      method: "GET",
      headers: tmdbHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch TV genres: ${response.status}`);
    }

    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
};

import axios from "./axios";

export const getAllMovies = async () => {
  const res = await axios.get("/movies");
  return res.data;
};

// TMDB API functions
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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

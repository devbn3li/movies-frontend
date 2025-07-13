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

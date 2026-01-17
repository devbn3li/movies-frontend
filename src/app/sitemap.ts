import { MetadataRoute } from "next";

type TMDBMovie = {
  id: number;
  title?: string;
  release_date?: string;
};

type TMDBTVShow = {
  id: number;
  name?: string;
  first_air_date?: string;
};

// استخدام TMDB مباشرة لتجنب 403 errors
async function getPopularMovies(): Promise<TMDBMovie[]> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    };

    // Get multiple pages of popular movies
    const pages = [1, 2, 3, 4, 5]; // First 5 pages = 100 movies
    const allResults = await Promise.all(
      pages.map(async (page) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
          options
        );
        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        }
        return [];
      })
    );

    return allResults.flat();
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return [];
  }
}

async function getPopularTVShows(): Promise<TMDBTVShow[]> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    };

    // Get multiple pages of popular TV shows
    const pages = [1, 2, 3, 4, 5]; // First 5 pages = 100 TV shows
    const allResults = await Promise.all(
      pages.map(async (page) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${page}`,
          options
        );
        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        }
        return [];
      })
    );

    return allResults.flat();
  } catch (error) {
    console.error("Error fetching TV shows from TMDB:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviezone-inky.vercel.app/";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/main-movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/main-series`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    const movies = await getPopularMovies();
    const moviePages = movies.map((movie: TMDBMovie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: movie.release_date
        ? new Date(movie.release_date)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const tvShows = await getPopularTVShows();
    const seriesPages = tvShows.map((series: TMDBTVShow) => ({
      url: `${baseUrl}/series/${series.id}`,
      lastModified: series.first_air_date
        ? new Date(series.first_air_date)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...moviePages, ...seriesPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

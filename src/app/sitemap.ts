import { MetadataRoute } from "next";
import { generateSlug } from "@/lib/slug-utils";

type TMDBMovie = {
  id: number;
  title?: string;
  release_date?: string;
  poster_path?: string;
};

type TMDBTVShow = {
  id: number;
  name?: string;
  first_air_date?: string;
  poster_path?: string;
};

async function getPopularMovies(): Promise<TMDBMovie[]> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    };

    const pages = Array.from({ length: 500 }, (_, i) => i + 1);
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
      next: { revalidate: 3600 },
    };

    const pages = Array.from({ length: 500 }, (_, i) => i + 1);
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

// Get trending content for additional sitemap entries
async function getTrendingContent(): Promise<{ movies: TMDBMovie[]; tvShows: TMDBTVShow[] }> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    };

    const [moviesRes, tvRes] = await Promise.all([
      fetch("https://api.themoviedb.org/3/trending/movie/week?language=en-US", options),
      fetch("https://api.themoviedb.org/3/trending/tv/week?language=en-US", options),
    ]);

    const movies = moviesRes.ok ? (await moviesRes.json()).results || [] : [];
    const tvShows = tvRes.ok ? (await tvRes.json()).results || [] : [];

    return { movies, tvShows };
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return { movies: [], tvShows: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://moviezone-inky.vercel.app";

  // Static pages with high priority
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
      priority: 0.95,
    },
    {
      url: `${baseUrl}/main-series`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
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
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    // Fetch all content in parallel
    const [movies, tvShows, trending] = await Promise.all([
      getPopularMovies(),
      getPopularTVShows(),
      getTrendingContent(),
    ]);

    // Combine popular and trending movies (remove duplicates)
    const allMovieIds = new Set<number>();
    const allMovies: TMDBMovie[] = [];

    [...movies, ...trending.movies].forEach((movie) => {
      if (!allMovieIds.has(movie.id)) {
        allMovieIds.add(movie.id);
        allMovies.push(movie);
      }
    });

    // Combine popular and trending TV shows (remove duplicates)
    const allTVIds = new Set<number>();
    const allTVShows: TMDBTVShow[] = [];

    [...tvShows, ...trending.tvShows].forEach((show) => {
      if (!allTVIds.has(show.id)) {
        allTVIds.add(show.id);
        allTVShows.push(show);
      }
    });

    // Generate movie pages with slugs
    const moviePages: MetadataRoute.Sitemap = allMovies.map(
      (movie: TMDBMovie) => {
        const slug = movie.title ? generateSlug(movie.title) : "";
        const url = slug 
          ? `${baseUrl}/movie/${movie.id}/${slug}` 
          : `${baseUrl}/movie/${movie.id}`;
        return {
          url,
          lastModified: movie.release_date
            ? new Date(movie.release_date)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      }
    );

    // Generate series pages with slugs
    const seriesPages: MetadataRoute.Sitemap = allTVShows.map(
      (series: TMDBTVShow) => {
        const slug = series.name ? generateSlug(series.name) : "";
        const url = slug 
          ? `${baseUrl}/series/${series.id}/${slug}` 
          : `${baseUrl}/series/${series.id}`;
        return {
          url,
          lastModified: series.first_air_date
            ? new Date(series.first_air_date)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      }
    );

    return [...staticPages, ...moviePages, ...seriesPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

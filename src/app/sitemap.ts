import { MetadataRoute } from "next";
import { getMovies, getTVShows } from "@/lib/api";
import { Movie, TVShow } from "@/types/index";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviezone.me";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/main-movies`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/main-series`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  try {
    // Dynamic pages for movies
    const moviesResponse = await getMovies({ limit: 10000 });
    const moviePages =
      moviesResponse?.results?.map((movie: Movie) => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    // Dynamic pages for TV shows/series
    const tvShowsResponse = await getTVShows({ limit: 10000 });
    const seriesPages =
      tvShowsResponse?.results?.map((series: TVShow) => ({
        url: `${baseUrl}/series/${series.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...moviePages, ...seriesPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

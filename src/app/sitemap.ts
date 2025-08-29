import { MetadataRoute } from "next";
import { getMovies, getTVShows } from "@/lib/api";
import { Movie, TVShow } from "@/types/index";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviezone.me";

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
    const moviesResponse = await getMovies({ limit: 5000 });
    const moviePages =
      moviesResponse?.results?.map((movie: Movie) => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: movie.release_date
          ? new Date(movie.release_date)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    const tvShowsResponse = await getTVShows({ limit: 5000 });
    const seriesPages =
      tvShowsResponse?.results?.map((series: TVShow) => ({
        url: `${baseUrl}/series/${series.id}`,
        lastModified: series.first_air_date
          ? new Date(series.first_air_date)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    return [...staticPages, ...moviePages, ...seriesPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

import type { MetadataRoute } from "next";

const BASE_URL = "https://moviezone-inky.vercel.app";

// Number of chunks for movies and series
const MOVIE_SITEMAP_COUNT = 20;
const SERIES_SITEMAP_COUNT = 20;

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemaps: MetadataRoute.Sitemap = [];

  // Use a fixed date for sitemap index - this is acceptable as Google
  // will crawl the individual sitemaps which have accurate TMDB dates
  const indexDate = new Date("2024-01-01");

  // Add static pages sitemap reference
  sitemaps.push({
    url: `${BASE_URL}/sitemap-pages.xml`,
    lastModified: indexDate,
  });

  // Add movie sitemaps
  for (let i = 1; i <= MOVIE_SITEMAP_COUNT; i++) {
    sitemaps.push({
      url: `${BASE_URL}/sitemap-movies/${i}.xml`,
      lastModified: indexDate,
    });
  }

  // Add series sitemaps
  for (let i = 1; i <= SERIES_SITEMAP_COUNT; i++) {
    sitemaps.push({
      url: `${BASE_URL}/sitemap-series/${i}.xml`,
      lastModified: indexDate,
    });
  }

  return sitemaps;
}

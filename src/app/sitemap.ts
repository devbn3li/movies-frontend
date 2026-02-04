import type { MetadataRoute } from "next";

const BASE_URL = "https://moviezone-inky.vercel.app";

// Number of chunks for movies and series
const MOVIE_SITEMAP_COUNT = 20;
const SERIES_SITEMAP_COUNT = 20;

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemaps: MetadataRoute.Sitemap = [];

  // Add static pages sitemap reference
  sitemaps.push({
    url: `${BASE_URL}/sitemap-pages.xml`,
    lastModified: new Date(),
  });

  // Add movie sitemaps
  for (let i = 1; i <= MOVIE_SITEMAP_COUNT; i++) {
    sitemaps.push({
      url: `${BASE_URL}/sitemap-movies/${i}.xml`,
      lastModified: new Date(),
    });
  }

  // Add series sitemaps
  for (let i = 1; i <= SERIES_SITEMAP_COUNT; i++) {
    sitemaps.push({
      url: `${BASE_URL}/sitemap-series/${i}.xml`,
      lastModified: new Date(),
    });
  }

  return sitemaps;
}

import { NextResponse } from "next/server";

const BASE_URL = "https://moviezone-inky.vercel.app";

export async function GET() {
  // Use a fixed date for static pages - update this when content actually changes
  const lastmod = "2024-01-01";

  // Static pages with SEO importance
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/main-movies", priority: "0.95", changefreq: "daily" },
    { url: "/main-series", priority: "0.95", changefreq: "daily" },
    {
      url: "/main-movies?sortBy=popularity",
      priority: "0.9",
      changefreq: "daily",
    },
    {
      url: "/main-movies?sortBy=rating",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/main-movies?sortBy=release_date",
      priority: "0.9",
      changefreq: "daily",
    },
    {
      url: "/main-series?sortBy=popularity",
      priority: "0.9",
      changefreq: "daily",
    },
    {
      url: "/main-series?sortBy=rating",
      priority: "0.9",
      changefreq: "weekly",
    },
    { url: "/contact", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "monthly" },
    { url: "/terms", priority: "0.3", changefreq: "monthly" },
    { url: "/help", priority: "0.4", changefreq: "monthly" },
    { url: "/disclaimer", priority: "0.3", changefreq: "monthly" },
  ];

  const urlsXml = staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

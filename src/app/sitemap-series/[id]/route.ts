import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug-utils";

const BASE_URL = "https://moviezone-inky.vercel.app";
const PAGES_PER_CHUNK = 25; // 20 results per page = 500 series

type TMDBTVShow = {
  id: number;
  name?: string;
  first_air_date?: string;
  last_air_date?: string;
};

async function getSeriesForChunk(chunkId: number): Promise<TMDBTVShow[]> {
  const startPage = (chunkId - 1) * PAGES_PER_CHUNK + 1;

  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 86400 } as RequestInit["next"],
    };

    const pages = Array.from(
      { length: PAGES_PER_CHUNK },
      (_, i) => startPage + i,
    );

    const results = await Promise.all(
      pages.map(async (page) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${page}`,
            options,
          );
          if (response.ok) {
            const data = await response.json();
            return data.results || [];
          }
        } catch {
          // Ignore errors for individual pages
        }
        return [];
      }),
    );

    return results.flat();
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return [];
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  // Remove .xml extension if present
  const cleanId = id.replace(/\.xml$/, "");
  const chunkId = parseInt(cleanId);

  if (isNaN(chunkId) || chunkId < 1) {
    return new NextResponse("Invalid sitemap ID", { status: 400 });
  }

  const series = await getSeriesForChunk(chunkId);

  const urlsXml = series
    .map((show) => {
      const slug = show.name ? generateSlug(show.name) : "";
      const url = slug
        ? `${BASE_URL}/series/${show.id}/${slug}`
        : `${BASE_URL}/series/${show.id}`;

      // Use TMDB last_air_date or first_air_date instead of current date
      const lastmod = show.last_air_date || show.first_air_date || "2024-01-01";

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

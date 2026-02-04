import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slug-utils";

const BASE_URL = "https://moviezone-inky.vercel.app";
const CHUNK_SIZE = 500; // URLs per sitemap
const PAGES_PER_CHUNK = 25; // 20 results per page = 500 movies

type TMDBMovie = {
  id: number;
  title?: string;
  release_date?: string;
};

async function getMoviesForChunk(chunkId: number): Promise<TMDBMovie[]> {
  const startPage = (chunkId - 1) * PAGES_PER_CHUNK + 1;
  const endPage = startPage + PAGES_PER_CHUNK - 1;

  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 86400 } as RequestInit["next"], // Cache for 24 hours
    };

    const pages = Array.from(
      { length: PAGES_PER_CHUNK }, 
      (_, i) => startPage + i
    );

    const results = await Promise.all(
      pages.map(async (page) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
            options
          );
          if (response.ok) {
            const data = await response.json();
            return data.results || [];
          }
        } catch {
          // Ignore errors for individual pages
        }
        return [];
      })
    );

    return results.flat();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chunkId = parseInt(id);

  if (isNaN(chunkId) || chunkId < 1) {
    return new NextResponse("Invalid sitemap ID", { status: 400 });
  }

  const movies = await getMoviesForChunk(chunkId);
  const now = new Date().toISOString();

  const urlsXml = movies.map(movie => {
    const slug = movie.title ? generateSlug(movie.title) : "";
    const url = slug 
      ? `${BASE_URL}/movie/${movie.id}/${slug}`
      : `${BASE_URL}/movie/${movie.id}`;

    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join("");

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

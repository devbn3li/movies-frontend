/**
 * Utility functions for generating SEO-friendly URL slugs
 */

/**
 * Convert a title to a URL-friendly slug
 * Handles Arabic and English text
 */
export function generateSlug(title: string): string {
  if (!title) return "";

  return title
    // Convert to lowercase
    .toLowerCase()
    // Replace Arabic characters with latin equivalents (keep Arabic for SEO)
    // Replace spaces and special characters with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove special characters except hyphens and alphanumeric (including Arabic)
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, "-")
    // Trim hyphens from start and end
    .replace(/^-+|-+$/g, "")
    // Limit length for URL
    .substring(0, 100);
}

/**
 * Generate a movie URL with slug
 */
export function generateMovieUrl(id: number, title: string): string {
  const slug = generateSlug(title);
  return slug ? `/movie/${id}/${slug}` : `/movie/${id}`;
}

/**
 * Generate a series URL with slug
 */
export function generateSeriesUrl(id: number, name: string): string {
  const slug = generateSlug(name);
  return slug ? `/series/${id}/${slug}` : `/series/${id}`;
}

/**
 * Generate a full canonical URL for a movie
 */
export function generateFullMovieUrl(id: number, title: string): string {
  const baseUrl = "https://moviezone-inky.vercel.app";
  const slug = generateSlug(title);
  return slug ? `${baseUrl}/movie/${id}/${slug}` : `${baseUrl}/movie/${id}`;
}

/**
 * Generate a full canonical URL for a series
 */
export function generateFullSeriesUrl(id: number, name: string): string {
  const baseUrl = "https://moviezone-inky.vercel.app";
  const slug = generateSlug(name);
  return slug ? `${baseUrl}/series/${id}/${slug}` : `${baseUrl}/series/${id}`;
}

/**
 * Extract movie/series ID from URL path
 * Handles both old format (/movie/123) and new format (/movie/123/movie-name)
 */
export function extractIdFromPath(path: string): number | null {
  const match = path.match(/\/(movie|series)\/(\d+)/);
  return match ? parseInt(match[2]) : null;
}

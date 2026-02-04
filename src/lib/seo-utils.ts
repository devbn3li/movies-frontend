/**
 * SEO utility functions for generating dynamic keywords and metadata
 */

// Arabic keywords for common search terms
export const ARABIC_KEYWORDS = {
  movie: [
    "مشاهدة",
    "فيلم",
    "افلام",
    "تحميل",
    "مترجم",
    "كامل",
    "اون لاين",
    "بجودة عالية",
    "HD",
    "مشاهدة مباشرة",
  ],
  series: [
    "مشاهدة",
    "مسلسل",
    "مسلسلات",
    "تحميل",
    "مترجم",
    "كامل",
    "جميع الحلقات",
    "اون لاين",
    "بجودة عالية",
    "HD",
  ],
  general: [
    "موفي زون",
    "مشاهدة افلام",
    "مشاهدة مسلسلات",
    "افلام جديدة",
    "مسلسلات جديدة",
    "افلام اجنبية",
    "مسلسلات اجنبية",
    "افلام مترجمة",
    "مسلسلات مترجمة",
  ],
};

// Common English search patterns
export const ENGLISH_KEYWORDS = {
  movie: [
    "watch",
    "movie",
    "film",
    "online",
    "free",
    "stream",
    "HD",
    "full movie",
    "download",
    "streaming",
  ],
  series: [
    "watch",
    "TV show",
    "series",
    "online",
    "free",
    "stream",
    "HD",
    "all episodes",
    "download",
    "streaming",
  ],
  general: [
    "Movie Zone",
    "watch movies",
    "watch TV shows",
    "new movies",
    "new series",
    "latest movies",
    "popular movies",
    "trending movies",
  ],
};

/**
 * Generate dynamic keywords for a movie
 */
export function generateMovieKeywords(
  title: string,
  originalTitle: string | null | undefined,
  year: string | null | undefined,
  genres: string[] | null | undefined,
  cast: string[] | null | undefined,
  director: string | null | undefined
): string[] {
  const keywords: string[] = [];

  // Title variations
  keywords.push(title);
  if (originalTitle && originalTitle !== title) {
    keywords.push(originalTitle);
  }

  // English search patterns
  keywords.push(`watch ${title} online`);
  keywords.push(`${title} full movie`);
  keywords.push(`${title} movie`);
  keywords.push(`stream ${title}`);
  if (year) {
    keywords.push(`${title} ${year}`);
    keywords.push(`${title} movie ${year}`);
  }

  // Arabic search patterns
  keywords.push(`مشاهدة فيلم ${title}`);
  keywords.push(`فيلم ${title} مترجم`);
  keywords.push(`فيلم ${title} كامل`);
  keywords.push(`تحميل فيلم ${title}`);
  if (year) {
    keywords.push(`فيلم ${title} ${year}`);
  }

  // Genres
  if (genres && genres.length > 0) {
    keywords.push(...genres);
    genres.forEach((genre) => {
      keywords.push(`${genre} movies`);
      keywords.push(`افلام ${genre}`);
    });
  }

  // Cast keywords
  if (cast && cast.length > 0) {
    const topCast = cast.slice(0, 5);
    keywords.push(...topCast);
    topCast.forEach((actor) => {
      keywords.push(`${actor} movies`);
    });
  }

  // Director
  if (director) {
    keywords.push(director);
    keywords.push(`${director} movies`);
  }

  // General keywords
  keywords.push("Movie Zone", "free movies", "watch online", "HD streaming");

  return [...new Set(keywords.filter(Boolean))];
}

/**
 * Generate dynamic keywords for a TV series
 */
export function generateSeriesKeywords(
  name: string,
  originalName: string | null | undefined,
  year: string | null | undefined,
  genres: string[] | null | undefined,
  cast: string[] | null | undefined,
  creator: string | null | undefined
): string[] {
  const keywords: string[] = [];

  // Title variations
  keywords.push(name);
  if (originalName && originalName !== name) {
    keywords.push(originalName);
  }

  // English search patterns
  keywords.push(`watch ${name} online`);
  keywords.push(`${name} TV series`);
  keywords.push(`${name} all episodes`);
  keywords.push(`stream ${name}`);
  if (year) {
    keywords.push(`${name} ${year}`);
    keywords.push(`${name} series ${year}`);
  }

  // Arabic search patterns
  keywords.push(`مشاهدة مسلسل ${name}`);
  keywords.push(`مسلسل ${name} مترجم`);
  keywords.push(`مسلسل ${name} كامل`);
  keywords.push(`مسلسل ${name} جميع الحلقات`);
  keywords.push(`تحميل مسلسل ${name}`);
  if (year) {
    keywords.push(`مسلسل ${name} ${year}`);
  }

  // Genres
  if (genres && genres.length > 0) {
    keywords.push(...genres);
    genres.forEach((genre) => {
      keywords.push(`${genre} TV shows`);
      keywords.push(`مسلسلات ${genre}`);
    });
  }

  // Cast keywords
  if (cast && cast.length > 0) {
    const topCast = cast.slice(0, 5);
    keywords.push(...topCast);
    topCast.forEach((actor) => {
      keywords.push(`${actor} TV shows`);
    });
  }

  // Creator
  if (creator) {
    keywords.push(creator);
    keywords.push(`${creator} series`);
  }

  // General keywords
  keywords.push("Movie Zone", "free TV shows", "watch online", "HD streaming");

  return [...new Set(keywords.filter(Boolean))];
}

/**
 * Generate enhanced description for a movie
 */
export function generateMovieDescription(
  title: string,
  overview: string | null | undefined,
  year: string | null | undefined,
  genres: string[] | null | undefined,
  rating: number | null | undefined
): string {
  if (overview && overview.length > 50) {
    // Use the overview but add SEO-friendly prefix
    const prefix = `Watch ${title}${year ? ` (${year})` : ""} online for free. `;
    const ratingText =
      rating && rating > 0 ? ` Rating: ${rating.toFixed(1)}/10.` : "";
    const genreText =
      genres && genres.length > 0 ? ` Genre: ${genres.slice(0, 3).join(", ")}.` : "";

    return `${prefix}${overview.substring(0, 200)}...${ratingText}${genreText} Stream HD quality on Movie Zone.`;
  }

  // Fallback description
  const genreText = genres && genres.length > 0 ? genres.slice(0, 3).join(", ") : "entertainment";
  return `Watch ${title}${year ? ` (${year})` : ""} movie online for free in HD quality. Discover ${genreText} and more on Movie Zone - your ultimate streaming destination.`;
}

/**
 * Generate enhanced description for a TV series
 */
export function generateSeriesDescription(
  name: string,
  overview: string | null | undefined,
  year: string | null | undefined,
  genres: string[] | null | undefined,
  rating: number | null | undefined,
  seasons: number | null | undefined
): string {
  if (overview && overview.length > 50) {
    const prefix = `Watch ${name}${year ? ` (${year})` : ""} TV series online for free. `;
    const ratingText =
      rating && rating > 0 ? ` Rating: ${rating.toFixed(1)}/10.` : "";
    const seasonsText = seasons && seasons > 0 ? ` ${seasons} season${seasons > 1 ? "s" : ""}.` : "";
    const genreText =
      genres && genres.length > 0 ? ` Genre: ${genres.slice(0, 3).join(", ")}.` : "";

    return `${prefix}${overview.substring(0, 200)}...${ratingText}${seasonsText}${genreText} Stream all episodes on Movie Zone.`;
  }

  // Fallback description
  const genreText = genres && genres.length > 0 ? genres.slice(0, 3).join(", ") : "entertainment";
  return `Watch ${name}${year ? ` (${year})` : ""} TV series online for free in HD quality. All episodes available. Discover ${genreText} and more on Movie Zone.`;
}

/**
 * Generate canonical URL with slug
 */
export function generateCanonicalUrl(type: "movie" | "series", id: number, title?: string): string {
  const baseUrl = "https://moviezone-inky.vercel.app";
  if (title) {
    const slug = generateSlugForSEO(title);
    if (slug) {
      return `${baseUrl}/${type}/${id}/${slug}`;
    }
  }
  return `${baseUrl}/${type}/${id}`;
}

/**
 * Generate breadcrumb items with slug
 */
export function generateBreadcrumbs(
  type: "movie" | "series",
  title: string,
  id: number
): Array<{ name: string; url: string }> {
  const baseUrl = "https://moviezone-inky.vercel.app";
  const slug = generateSlugForSEO(title);
  const itemUrl = slug ? `${baseUrl}/${type}/${id}/${slug}` : `${baseUrl}/${type}/${id}`;

  return [
    { name: "Home", url: baseUrl },
    {
      name: type === "movie" ? "Movies" : "TV Series",
      url: `${baseUrl}/${type === "movie" ? "main-movies" : "main-series"}`,
    },
    { name: title, url: itemUrl },
  ];
}

/**
 * Generate SEO-friendly slug from title
 */
function generateSlugForSEO(title: string): string {
  if (!title) return "";

  return title
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

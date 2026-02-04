import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Movie } from "@/types/index";
import MoviePage from "../MoviePage";
import {
  generateMovieKeywords,
  generateMovieDescription,
  generateBreadcrumbs,
} from "@/lib/seo-utils";
import { generateSlug, generateFullMovieUrl } from "@/lib/slug-utils";

// Types for TMDB responses
interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

// TMDB Movie Details API function
async function getMovieDetails(movieId: number) {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      options
    );

    if (response.ok) {
      const tmdbData = await response.json();
      return tmdbData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return null;
  }
}

// Get movie credits (cast and crew)
async function getMovieCredits(movieId: number): Promise<TMDBCredits | null> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      options
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ movieId: string; slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { movieId, slug } = await params;
  const id = parseInt(movieId);

  let movie: Movie | null = null;
  let credits: TMDBCredits | null = null;

  // Fetch movie and credits in parallel
  try {
    const [tmdbMovie, tmdbCredits] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
    ]);

    credits = tmdbCredits;

    if (tmdbMovie) {
      movie = {
        id: tmdbMovie.id,
        title: tmdbMovie.title,
        original_title: tmdbMovie.original_title,
        overview: tmdbMovie.overview,
        release_date: tmdbMovie.release_date,
        genre_names:
          tmdbMovie.genres?.map((g: { id: number; name: string }) => g.name) ||
          [],
        poster_url: tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
          : null,
        backdrop_url: tmdbMovie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`
          : null,
        popularity: tmdbMovie.popularity,
        vote_average: tmdbMovie.vote_average,
        vote_count: tmdbMovie.vote_count,
        original_language: tmdbMovie.original_language,
        video: tmdbMovie.video,
      };
    }
  } catch (error) {
    console.error("Error fetching movie from TMDB:", error);
    // Fallback metadata if movie fetch fails
    return {
      title: `Movie - Movie Zone`,
      description: `Watch this amazing movie and discover more entertainment on Movie Zone. مشاهدة الفيلم اون لاين مترجم على موفي زون.`,
      keywords: [
        "movie",
        "watch online",
        "streaming",
        "entertainment",
        "مشاهدة",
        "فيلم",
        "مترجم",
        "اون لاين",
      ],
      alternates: {
        canonical: `https://moviezone-inky.vercel.app/movie/${movieId}`,
      },
      openGraph: {
        title: `Movie - Movie Zone`,
        description: `Watch this amazing movie and discover more entertainment on Movie Zone.`,
        url: `https://moviezone-inky.vercel.app/movie/${movieId}`,
        type: "video.movie",
      },
    };
  }

  if (!movie) {
    return {
      title: `Movie - Movie Zone`,
      description: `Watch this amazing movie and discover more entertainment on Movie Zone. مشاهدة الفيلم اون لاين مترجم.`,
    };
  }

  const title = movie.title;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const genres = movie.genre_names || [];
  const poster = movie.poster_url || "/og-image.png";

  // Generate canonical URL with slug
  const canonicalUrl = generateFullMovieUrl(movie.id, title);
  const movieSlug = generateSlug(title);

  // Extract cast and director from credits
  const castNames = credits?.cast?.slice(0, 10).map((c) => c.name) || [];
  const director = credits?.crew?.find((c) => c.job === "Director")?.name;

  // Generate dynamic keywords with Arabic support
  const keywords = generateMovieKeywords(
    title,
    movie.original_title,
    year,
    genres,
    castNames,
    director
  );

  // Generate enhanced description
  const description = generateMovieDescription(
    title,
    movie.overview,
    year,
    genres,
    movie.vote_average
  );

  // Generate breadcrumbs for structured data (with slug)
  const breadcrumbs = [
    { name: "Home", url: "https://moviezone-inky.vercel.app" },
    { name: "Movies", url: "https://moviezone-inky.vercel.app/main-movies" },
    { name: title, url: canonicalUrl },
  ];

  // Create JSON-LD structured data
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": canonicalUrl,
    name: title,
    alternateName: movie.original_title !== title ? movie.original_title : undefined,
    description: movie.overview,
    image: [poster, movie.backdrop_url].filter(Boolean),
    url: canonicalUrl,
    datePublished: movie.release_date,
    inLanguage: movie.original_language,
    genre: genres,
    director: director
      ? {
        "@type": "Person",
        name: director,
      }
      : undefined,
    actor: credits?.cast?.slice(0, 10).map((actor) => ({
      "@type": "Person",
      name: actor.name,
    })),
    aggregateRating:
      movie.vote_average && movie.vote_count
        ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: movie.vote_count,
        }
        : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  // Clean undefined values from schema
  const cleanMovieSchema = JSON.parse(JSON.stringify(movieSchema));

  return {
    title: `${title}${year ? ` (${year})` : ""} - Watch Movie Online | Movie Zone`,
    description,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title}${year ? ` (${year})` : ""} - Watch Free on Movie Zone`,
      description,
      images: [
        {
          url: poster,
          width: 500,
          height: 750,
          alt: `${title} movie poster - مشاهدة فيلم ${title}`,
        },
      ],
      url: canonicalUrl,
      type: "video.movie",
      siteName: "Movie Zone",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${year ? ` (${year})` : ""} - Watch Free`,
      description,
      images: [poster],
      site: "@MovieZone",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:section": "Entertainment",
      "article:tag": genres.join(", "),
      "application/ld+json": JSON.stringify([cleanMovieSchema, breadcrumbSchema]),
    },
  };
}

export default async function Page({ params }: Props) {
  const { movieId, slug } = await params;
  const id = parseInt(movieId);

  // Fetch movie to get the correct slug for redirect
  const tmdbMovie = await getMovieDetails(id);

  if (tmdbMovie) {
    const correctSlug = generateSlug(tmdbMovie.title);
    const currentSlug = slug?.[0] || "";

    // Redirect to correct slug URL if slug is missing or incorrect
    if (correctSlug && correctSlug !== currentSlug) {
      redirect(`/movie/${id}/${correctSlug}`);
    }
  }

  return <MoviePage movieId={id} />;
}

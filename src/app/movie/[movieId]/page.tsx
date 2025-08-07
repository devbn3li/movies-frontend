import { Metadata } from "next";
import { Movie } from "@/types/index";
import MoviePage from "./MoviePage";
import { getAllContent } from "@/lib/api";

type APIContentItem = {
  id: number;
  type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  genre_names?: string[];
  poster_url?: string;
  backdrop_url?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  original_language?: string;
  adult?: boolean;
  video?: boolean;
};

// TMDB Movie Details API function
async function getMovieDetails(movieId: number) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      }
    };

    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options);

    if (response.ok) {
      const tmdbData = await response.json();
      return tmdbData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ movieId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { movieId } = await params;
  const id = parseInt(movieId);

  let movie: Movie | null = null;

  // Try to get movie data from API first
  try {
    const apiResponse = await getAllContent({
      page: 1,
      limit: 1000, // Get more items to increase chance of finding the movie
    });

    // Check if we can find the movie in the API response
    if (apiResponse && apiResponse.content) {
      const foundMovie = apiResponse.content.find((m: APIContentItem) => m.id === id && (m.type === "movie" || !m.type)) || null;

      // Transform the API response to match Movie interface
      if (foundMovie) {
        movie = {
          id: foundMovie.id,
          title: foundMovie.title || foundMovie.name || "Unknown Movie",
          original_title: foundMovie.original_title || "",
          overview: foundMovie.overview || "",
          release_date: foundMovie.release_date || "",
          genre_names: foundMovie.genre_names || [],
          poster_url: foundMovie.poster_url || "",
          backdrop_url: foundMovie.backdrop_url || "",
          popularity: foundMovie.popularity || 0,
          vote_average: foundMovie.vote_average || 0,
          vote_count: foundMovie.vote_count || 0,
          original_language: foundMovie.original_language || "",
          adult: foundMovie.adult || false,
          video: foundMovie.video || false,
        } as Movie;
      }
    }
  } catch (error) {
    console.error('Error fetching movie from API:', error);
  }

  // If not found in API, try TMDB as fallback
  if (!movie) {
    try {
      const tmdbMovie = await getMovieDetails(id);
      if (tmdbMovie) {
        movie = {
          id: tmdbMovie.id,
          title: tmdbMovie.title,
          original_title: tmdbMovie.original_title,
          overview: tmdbMovie.overview,
          release_date: tmdbMovie.release_date,
          genre_names: tmdbMovie.genres?.map((g: { id: number; name: string }) => g.name) || [],
          poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w300${tmdbMovie.poster_path}` : null,
          backdrop_url: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}` : null,
          popularity: tmdbMovie.popularity,
          vote_average: tmdbMovie.vote_average,
          vote_count: tmdbMovie.vote_count,
          original_language: tmdbMovie.original_language,
          adult: tmdbMovie.adult,
          video: tmdbMovie.video,
        };
      }
    } catch (error) {
      console.error('Error fetching movie from TMDB:', error);
      // Fallback metadata if movie fetch fails
      return {
        title: `Movie - Movie Zone`,
        description: `Watch this amazing movie and discover more entertainment on Movie Zone.`,
        keywords: ["movie", "watch online", "streaming", "entertainment"],
        alternates: {
          canonical: `https://moviezone.me/movie/${movieId}`,
        },
        openGraph: {
          title: `Movie - Movie Zone`,
          description: `Watch this amazing movie and discover more entertainment on Movie Zone.`,
          url: `https://moviezone.me/movie/${movieId}`,
          type: "video.movie",
        },
      };
    }
  }

  if (!movie) {
    return {
      title: `Movie - Movie Zone`,
      description: `Watch this amazing movie and discover more entertainment on Movie Zone.`,
    };
  }

  const title = movie.title;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const description = movie.overview || `Watch ${title} ${year ? `(${year})` : ""} movie online. Discover cast, reviews, and more on Movie Zone.`;
  const poster = movie.poster_url || "/placeholder.jpg";
  const genres = movie.genre_names?.join(", ") || "";

  return {
    title: `${title}${year ? ` (${year})` : ""} - Watch Movie Online | Movie Zone`,
    description,
    keywords: [
      title,
      "movie",
      "watch online",
      "streaming",
      "cinema",
      genres,
      year,
      "Movie Zone"
    ].filter(Boolean),
    alternates: {
      canonical: `https://moviezone.me/movie/${movieId}`,
    },
    openGraph: {
      title: `${title}${year ? ` (${year})` : ""} - Movie Zone`,
      description,
      images: [
        {
          url: poster,
          width: 500,
          height: 750,
          alt: `${title} poster`,
        },
      ],
      url: `https://moviezone.me/movie/${movieId}`,
      type: "video.movie",
      siteName: "Movie Zone",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${year ? ` (${year})` : ""}`,
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
      "article:tag": genres,
    },
  };
}

export default async function Page({ params }: Props) {
  const { movieId } = await params;
  return <MoviePage movieId={parseInt(movieId)} />;
}
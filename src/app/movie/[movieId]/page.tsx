import { Metadata } from "next";
import { Movie } from "@/types/index";
import MoviePage from "./MoviePage";
import { getMovies } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ movieId: string }>;
}): Promise<Metadata> {
  const { movieId } = await params;
  const id = Number(movieId);

  let movie: Movie | null = null;

  // Try to get movie data from API
  try {
    const apiResponse = await getMovies({
      page: 1,
      limit: 1,
      // For now, we'll rely on a simple approach
      // In the future, we might need a specific endpoint for single movie by ID
    });

    if (apiResponse && apiResponse.movies) {
      movie = apiResponse.movies.find((m: Movie) => m.id === id) || null;
    }
  } catch (error) {
    console.error('Error fetching movie from API:', error);
  }

  if (!movie) {
    // Fallback metadata if movie not found
    return {
      title: `Movie - Movie Zone`,
      description: `Watch this amazing movie and discover more entertainment on Movie Zone.`,
    };
  }

  const title = movie.title;
  const description = movie.overview || "Watch your favorite content now.";
  const url = `https://moviezone.me/movie/${movie.id}`;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return {
    title: `${title}${year ? ` (${year})` : ''} - Movie Zone`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: movie.poster_url || '/placeholder.jpg', width: 1200, height: 630, alt: title }],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [movie.poster_url || '/placeholder.jpg'],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;
  return <MoviePage movieId={parseInt(movieId)} />;
}
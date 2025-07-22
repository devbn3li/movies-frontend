import { Metadata } from "next";
import mediaData from "@/assets/moviesdb.json";
import { Movie, TVShow } from "@/types/index";
import MoviePage from "./MoviePage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ movieId: string }>;
}): Promise<Metadata> {
  const { movieId } = await params;
  const { movies, tv_shows } = mediaData as {
    movies: Movie[];
    tv_shows: TVShow[];
  };

  const id = Number(movieId);
  const all = [...movies, ...tv_shows];
  const item = all.find((m) => m.id === id);
  if (!item) return {};

  const title = "title" in item ? item.title : item.name;
  const description = item.overview || "Watch your favorite content now.";
  const url = `https://moviezone.me/movie/${item.id}`;
  const year = "release_date" in item ? new Date(item.release_date).getFullYear() : new Date(item.first_air_date).getFullYear();

  return {
    title: `${title}${year ? ` (${year})` : ''} - Movie Zone`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: item.poster_url || '/placeholder.jpg', width: 1200, height: 630, alt: title }],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [item.poster_url || '/placeholder.jpg'],
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
  return <MoviePage movieId={movieId} />;
}
"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { containsSensitiveContent } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  poster_url?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_names?: string[];
  overview?: string;
  popularity?: number;
  adult?: boolean;
  [key: string]: unknown;
}

const FeaturedContent = ({
  type,
  title,
  isLarge,
  showViewAllLink = true
}: {
  type: "movie" | "tv";
  title: string;
  isLarge: boolean;
  showViewAllLink?: boolean;
}) => {
  const [featuredContent, setFeaturedContent] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Helper functions
  const getPosterUrl = (movie: Movie) => {
    const posterFields = [
      'poster_path',
      'poster_url',
      'image',
      'thumbnail',
      'backdrop_path'
    ];

    for (const field of posterFields) {
      const value = movie[field];
      if (value && typeof value === 'string') {
        if (value.startsWith('http')) {
          return value;
        }
        if (value.startsWith('/')) {
          return `https://image.tmdb.org/t/p/w500${value}`;
        }
        return value;
      }
    }

    return "/placeholder-avatar.svg";
  };

  const getYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const getRating = (vote_average: number | undefined) => {
    if (!vote_average) return null;
    return (vote_average / 2).toFixed(1); // Convert from 10 to 5 scale
  };

  const getBadge = (movie: Movie) => {
    if (movie.adult) {
      return { text: "18+", color: "bg-red-600" };
    }

    const title = movie.title || movie.name || "";
    if (containsSensitiveContent(title)) {
      return { text: "Sensitive", color: "bg-orange-600" };
    }

    if (!movie.vote_average || !movie.popularity) return null;

    if (movie.vote_average >= 8) return { text: "High Rated", color: "badge-high-rating" };
    if (movie.popularity >= 1000) return { text: "Popular", color: "badge-popular" };

    const releaseDate = movie.release_date || movie.first_air_date;
    if (releaseDate) {
      const releaseYear = new Date(releaseDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - releaseYear <= 1) return { text: "New", color: "badge-new" };
    }

    return null;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setIsLoading(true);
        const fileName = type === "movie" ? "/movies.json" : "/tv.json";
        const response = await fetch(fileName);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);
        const sortedByPopularity = data
          .filter((item: Movie) => item.popularity && item.popularity > 0)
          .sort((a: Movie, b: Movie) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 20);
        const filtered = sortedByPopularity.length > 0 ? sortedByPopularity : data.slice(0, 20);
        setFeaturedContent(filtered);
      } catch (error) {
        console.error(`❌ Error loading ${type} data:`, error);
        console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedContent();
  }, [type]);

  const filteredContent = featuredContent.filter((movie) => {
    if (isAdmin) return true;

    const title = movie.title || movie.name || "";
    const hasSensitiveContent = containsSensitiveContent(title);

    return !movie.adult && !hasSensitiveContent;
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          {showViewAllLink && <Skeleton className="h-6 w-24" />}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <Skeleton className={`${isLarge ? "h-80 w-52" : "h-60 w-40"} rounded-lg`} />
              <Skeleton className="h-4 w-32 mt-2" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredContent.length === 0 && !isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAllLink && (
            <Link
              href={type === "movie" ? "/main-movies" : "/main-series"}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No {type === "movie" ? "movies" : "TV shows"} available at the moment.</p>
          <p className="text-sm mt-2">
            Data loaded: {featuredContent.length} items |
            After filtering: {filteredContent.length} items |
            Admin: {isAdmin ? "Yes" : "No"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isLarge ? "w-full" : "max-w-[1080px]"} w-full mt-10 relative px-2`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white">
          {title}
        </h2>
        {showViewAllLink && (
          <Link
            href={type === "movie" ? "/main-movies" : "/main-series"}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            View All →
          </Link>
        )}
      </div>

      <Carousel opts={{ align: "center" }} className="w-full relative">
        <CarouselContent>
          {filteredContent.map((movie) => {
            const badge = getBadge(movie);
            const year = getYear(movie);
            const rating = getRating(movie.vote_average);
            const movieTitle = movie.title || movie.name || movie.original_title || movie.original_name || "Unknown Title";

            return (
              <CarouselItem
                key={movie.id}
                className="
                  basis-[90%] 
                  sm:basis-[50%] 
                  md:basis-[33.33%]
                  lg:basis-[25%]
                  xl:basis-[20%]
                  flex justify-center
                "
              >
                <Link href={`/${type === "movie" ? "movie" : "series"}/${movie.id}`} className="p-2 block">
                  <div className="relative group overflow-hidden rounded-2xl card-hover-glow">
                    {/* Badge */}
                    {badge && (
                      <div className={`absolute top-2 left-2 z-20 px-2 rounded-full font-bold text-white badge-bounce ${badge.color} shadow-lg`}>
                        {badge.text}
                      </div>
                    )}

                    {/* Rating */}
                    {rating && (
                      <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <span className="text-yellow-400 text-xs star-rating">⭐</span>
                        <span className="text-white text-xs font-semibold">{rating}</span>
                      </div>
                    )}

                    <Image
                      src={getPosterUrl(movie)}
                      alt={movieTitle}
                      className={`object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 ${!isAdmin && (movie.adult || containsSensitiveContent(movieTitle))
                        ? 'blur-sm group-hover:blur-none'
                        : ''
                        }`}
                      width={280}
                      height={420}
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                    {/* Enhanced Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                        {movieTitle}
                      </h3>

                      {/* Year and Genre */}
                      <div className="flex items-center gap-2 mb-2">
                        {year && (
                          <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                            {year}
                          </span>
                        )}
                        {movie.genre_names && movie.genre_names[0] && (
                          <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                            {movie.genre_names[0]}
                          </span>
                        )}
                      </div>

                      {/* Overview */}
                      {movie.overview && (
                        <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                          {truncateText(movie.overview, 100)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="left-[-10px] sm:left-[-20px]" />
        <CarouselNext className="right-[-10px] sm:right-[-20px]" />
      </Carousel>
    </div>
  );
};

export default FeaturedContent;

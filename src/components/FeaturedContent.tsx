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
import { useAuth } from "@/hooks/useAuth";
import { getMovies, getTVShows } from "@/lib/api";

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
    // Priority order for poster URLs from API
    const posterFields = [
      'poster_url',      // Primary field from API
      'poster_path',     // TMDB path
      'image',           // Alternative field
      'thumbnail',       // Fallback
      'backdrop_url',    // Last resort for backdrop
      'backdrop_path'    // TMDB backdrop
    ];

    for (const field of posterFields) {
      const value = movie[field];
      if (value && typeof value === 'string') {
        // If it's already a full URL, use it
        if (value.startsWith('http')) {
          return value;
        }
        // If it's a TMDB path, construct the URL
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

        let response;
        if (type === "movie") {
          response = await getMovies({
            page: 1,
            limit: 20,
            sort_by: "popularity",
            order: "desc"
          });
        } else {
          response = await getTVShows({
            page: 1,
            limit: 20,
            sort_by: "popularity",
            order: "desc"
          });
        }

        if (response) {
          const data = type === "movie" ? response.movies : response.tvShows;
          const filtered = data && data.length > 0 ? data : [];
          setFeaturedContent(filtered);
        } else {
          console.error(`❌ No data received from ${type} API`);
          setFeaturedContent([]);
        }
      } catch (error) {
        console.error(`❌ Error loading ${type} data:`, error);
        console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
        setFeaturedContent([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedContent();
  }, [type]);

  // No filtering needed - show all content
  const filteredContent = featuredContent;

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          {showViewAllLink && <Skeleton className="h-6 w-24" />}
        </div>
        <Carousel opts={{ align: "center" }} className="w-full relative">
          <CarouselContent>
            {Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="
                  basis-[90%] 
                  sm:basis-[50%] 
                  md:basis-[33.33%]
                  lg:basis-[25%]
                  xl:basis-[20%]
                  flex justify-center
                "
              >
                <div className="p-2 w-full">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Skeleton for poster */}
                    <Skeleton className="w-full h-[420px] rounded-2xl" />

                    {/* Skeleton for badges */}
                    <div className="absolute top-2 left-2">
                      <Skeleton className="w-12 h-6 rounded-full" />
                    </div>

                    <div className="absolute top-2 right-2">
                      <Skeleton className="w-12 h-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="left-[-10px] sm:left-[-20px]" />
          <CarouselNext className="right-[-10px] sm:right-[-20px]" />
        </Carousel>
      </div>
    );
  }

  if (filteredContent.length === 0 && !isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>
          {showViewAllLink && (
            <Link
              href={type === "movie" ? "/main-movies" : "/main-series"}
              className="dark:text-white dark:hover:text-gray-300 text-black hover:text-black/80 transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No {type === "movie" ? "movies" : "TV shows"} available at the moment.</p>
          <p className="text-sm mt-2">
            API Response: {featuredContent.length} items |
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
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-black dark:text-white">
          {title}
        </h2>
        {showViewAllLink && (
          <Link
            href={type === "movie" ? "/main-movies" : "/main-series"}
            className="dark:text-white dark:hover:text-gray-300 text-black hover:text-black/80 transition-colors text-sm font-medium"
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
                      className="object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                      width={280}
                      height={420}
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

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

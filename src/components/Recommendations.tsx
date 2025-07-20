import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { containsSensitiveContent } from "@/lib/utils";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  overview?: string;
  popularity?: number;
  adult?: boolean;
  original_title?: string;
  original_name?: string;
}

const Recommendations = ({ movieId, type }: { movieId: string; type: "movie" | "tv" }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions
  const getYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const getRating = (vote_average: number | undefined) => {
    if (!vote_average) return null;
    return (vote_average / 2).toFixed(1);
  };

  const getBadge = (movie: Movie) => {
    if (movie.adult) {
      return { text: "18+", color: "bg-red-600" };
    }

    // التحقق من المحتوى الحساس في العنوان
    const title = movie.title || movie.name || "";
    if (containsSensitiveContent(title)) {
      return { text: "Sensitive", color: "bg-orange-600" };
    }

    if (!movie.vote_average) return null;

    if (movie.vote_average >= 8) return { text: "High Rated", color: "bg-yellow-500" };
    if (movie.popularity && movie.popularity >= 1000) return { text: "Popular", color: "bg-red-500" };

    const releaseDate = movie.release_date || movie.first_air_date;
    if (releaseDate) {
      const releaseYear = new Date(releaseDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - releaseYear <= 1) return { text: "New", color: "bg-green-500" };
    }

    return null;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);

      const url = `https://api.themoviedb.org/3/${type}/${movieId}/recommendations?language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Filter out items without poster_path
        const filtered = data.results.filter((movie: Movie) => movie.poster_path);
        setRecommendations(filtered);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieId, type]);

  if (isLoading) {
    return (
      <div className="max-w-[1080px] w-full mt-10 relative px-2">
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
          Recommended for You
        </h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) return null;

  return (
    <div className="max-w-[1080px] w-full mt-10 relative px-2">
      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
        Recommended for You
      </h2>

      <Carousel opts={{ align: "center" }} className="w-full relative">
        <CarouselContent>
          {recommendations.map((movie) => (
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
              <Link href={`/${type === 'tv' ? 'series' : 'movie'}/${movie.id}`} className="p-2 block group">
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Badge */}
                  {getBadge(movie) && (
                    <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-xs font-bold text-white ${getBadge(movie)?.color}`}>
                      {getBadge(movie)?.text}
                    </div>
                  )}

                  {/* Rating */}
                  {movie.vote_average ? (
                    <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-white text-xs font-semibold">{getRating(movie.vote_average)}</span>
                    </div>
                  ) : null}

                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name || "Poster"}
                    className={`object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 ${movie.adult || containsSensitiveContent(movie.title || movie.name || "") ? 'blur-sm group-hover:blur-none' : ''
                      }`}
                    width={280}
                    height={420}
                  />

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Enhanced Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                      {movie.title || movie.name}
                    </h3>

                    {/* Year and Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      {getYear(movie) && (
                        <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                          {getYear(movie)}
                        </span>
                      )}
                      {movie.vote_average && (
                        <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                          ⭐ {movie.vote_average.toFixed(1)}
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
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="left-[-10px] sm:left-[-20px]" />
        <CarouselNext className="right-[-10px] sm:right-[-20px]" />
      </Carousel>
    </div>
  );
};

export default Recommendations;

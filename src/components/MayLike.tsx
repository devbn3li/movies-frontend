import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { containsSensitiveContent } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from '@tanstack/react-query';

interface Movie {
  id: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_names?: string[];
  overview?: string;
  popularity?: number;
  adult?: boolean;
}

const MayLike = ({ movieId, type }: { movieId: string; type: "movie" | "tv" }) => {
  const { isAdmin } = useAuth();

  // استخدام React Query للـ caching
  const { data: similarMovies = [] } = useQuery({
    queryKey: ['similar', type, movieId],
    queryFn: async () => {
      const url = `https://api.themoviedb.org/3/${type}/${movieId}/similar?language=en-US&page=1`;
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch similar movies');
      }

      const data = await response.json();
      return data.results.filter((movie: Movie) => movie.poster_path) as Movie[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!movieId, // فقط اعمل fetch لو movieId موجود
    refetchOnMount: false, // لا نعيد الـ fetch عند mount
    refetchOnWindowFocus: false, // لا نعيد الـ fetch عند focus
    refetchOnReconnect: false, // لا نعيد الـ fetch عند reconnect
  });

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

    if (!movie.vote_average || !movie.popularity) return null;

    if (movie.vote_average >= 8) return { text: "High Rated", color: "bg-yellow-500" };
    if (movie.popularity >= 1000) return { text: "Popular", color: "bg-red-500" };

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

  if (!similarMovies.length) return null;

  return (
    <div className="max-w-[1080px] w-full mt-10 relative px-2">
      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
        You Might Also Like
      </h2>

      <Carousel opts={{ align: "center" }} className="w-full relative">
        <CarouselContent>
          {similarMovies.map((movie) => (
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
              <Link href={`/movie/${movie.id}`} className="p-2 block">
                <div className="relative group overflow-hidden rounded-2xl">
                  {/* Badge */}
                  {getBadge(movie) && (
                    <div className={`absolute top-2 left-2 z-20 px-2 rounded-full font-bold text-white ${getBadge(movie)?.color}`}>
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
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title || movie.name || "Poster"}
                    className={`object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 ${!isAdmin && (movie.adult || containsSensitiveContent(movie.title || movie.name || ""))
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
                      {movie.title || movie.name}
                    </h3>

                    {/* Year and Genre */}
                    <div className="flex items-center gap-2 mb-2">
                      {getYear(movie) && (
                        <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                          {getYear(movie)}
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
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="left-[-10px] sm:left-[-20px]" />
        <CarouselNext className="right-[-10px] sm:right-[-20px]" />
      </Carousel>
    </div>
  );
};

export default MayLike;

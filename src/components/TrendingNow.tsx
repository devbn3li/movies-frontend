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

interface Movie {
  id: number;
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
}

const TrendingNow = ({ type, title, isLarge }: { type: "movie" | "tv"; title: string; isLarge: boolean }) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const mediaType = type === "movie" ? "movie" : "series";

  // Helper functions
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
    console.log("Trending movie IDs:", trendingMovies.map(m => m.id));
  }, [trendingMovies]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/trending/${type}/day?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(data => {
        const filtered = data.results.filter((movie: Movie) => movie.poster_path);
        setTrendingMovies(filtered);
      })
      .catch(err => console.error(err));
  }, [type]);

  if (!trendingMovies.length) return null;

  return (
    <div className={`${isLarge ? "w-full" : "max-w-[1080px]"} w-full mt-10 relative px-2`}>
      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
        Trending {title ? title : "Now"}
      </h2>

      <Carousel opts={{ align: "center" }} className="w-full relative">
        <CarouselContent>
          {trendingMovies.map((movie) => (
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
              <Link href={`/${mediaType}/${movie.id}`} className="p-2 block">
                <div className="relative group overflow-hidden rounded-2xl card-hover-glow">
                  {/* Badge */}
                  {getBadge(movie) && (
                    <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-xs font-bold text-white badge-bounce ${getBadge(movie)?.color} shadow-lg`}>
                      {getBadge(movie)?.text}
                    </div>
                  )}

                  {/* Rating */}
                  {movie.vote_average ? (
                    <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <span className="text-yellow-400 text-xs star-rating">⭐</span>
                      <span className="text-white text-xs font-semibold">{getRating(movie.vote_average)}</span>
                    </div>
                  ) : null}

                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name || "Trending Movie"}
                    className="object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
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

export default TrendingNow;

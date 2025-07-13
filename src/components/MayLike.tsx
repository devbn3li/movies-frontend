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
  id: string;
  title?: string;
  name?: string;
  poster_path: string | null;
}

const MayLike = ({ movieId, type }: { movieId: string; type: "movie" | "tv" }) => {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  useEffect(() => {
    console.log("Similar movie IDs:", similarMovies.map(m => m.id));
  }, [similarMovies]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/${type}/${movieId}/similar?language=en-US&page=1`;
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
        setSimilarMovies(filtered);
      })
      .catch(err => console.error(err));
  }, [movieId, type]);

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
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name || "Poster"}
                    className="object-cover h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    width={280}
                    height={420}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{movie.title || movie.name}</h3>
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

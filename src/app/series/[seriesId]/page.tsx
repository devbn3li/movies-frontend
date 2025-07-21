"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import mediaData from "@/assets/moviesdb.json";
import { notFound } from "next/navigation";
import { TVShow } from "@/types/index";
import { useMemo, useEffect, useState } from "react";
import MayLike from "@/components/MayLike";
import TrendingNow from "@/components/TrendingNow";
import WatchlistButton from "@/components/WatchlistButton";
import Cast from "@/components/Cast";
import Loading from "@/components/Loading";
import WatchProviders from "@/components/WatchProviders";
import Recommendations from "@/components/Recommendations";

// TMDB TV Show type
interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  origin_country: string[];
  adult: boolean;
}

// Convert TMDB data to local format
const convertTMDBToLocal = (tmdbShow: TMDBTVShow): TVShow => ({
  id: tmdbShow.id,
  name: tmdbShow.name,
  original_name: tmdbShow.original_name,
  overview: tmdbShow.overview,
  first_air_date: tmdbShow.first_air_date,
  genre_names: tmdbShow.genres.map(g => g.name),
  poster_url: tmdbShow.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}` : null,
  backdrop_url: tmdbShow.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbShow.backdrop_path}` : null,
  popularity: tmdbShow.popularity,
  vote_average: tmdbShow.vote_average,
  vote_count: tmdbShow.vote_count,
  original_language: tmdbShow.original_language,
  origin_country: tmdbShow.origin_country,
  adult: tmdbShow.adult,
});

export default function SeriesPage() {
  const params = useParams();
  const [item, setItem] = useState<TVShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const seriesId = useMemo(() => {
    if (!params?.seriesId || Array.isArray(params.seriesId)) return null;
    return Number(params.seriesId);
  }, [params]);

  useEffect(() => {
    if (!seriesId) {
      setIsLoading(false);
      return;
    }

    const fetchSeriesData = async () => {
      setIsLoading(true);

      // First, try to find in local data
      const { tv_shows } = mediaData as { tv_shows: TVShow[] };
      const localItem = tv_shows.find((m) => m.id === seriesId);

      if (localItem) {
        console.log(`✅ Found series ${seriesId} locally:`, localItem.name);
        setItem(localItem);
        setIsLoading(false);
        return;
      }

      // If not found locally, fetch from TMDB
      console.log(`🌐 Series ${seriesId} not found locally, fetching from TMDB...`);
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          }
        };

        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}`, options);

        if (response.ok) {
          const tmdbData: TMDBTVShow = await response.json();
          console.log(`✅ Successfully fetched series ${seriesId} from TMDB:`, tmdbData.name);
          const convertedItem = convertTMDBToLocal(tmdbData);
          setItem(convertedItem);
        } else {
          console.log(`❌ Series ${seriesId} not found on TMDB (Status: ${response.status})`);
          setItem(null);
        }
      } catch (error) {
        console.error('Error fetching from TMDB:', error);
        setItem(null);
      }

      setIsLoading(false);
    };

    fetchSeriesData();
  }, [seriesId]);

  if (isLoading) {
    return <Loading />;
  }

  if (!item) {
    return notFound();
  }

  const title = item.name;
  const rDate = item.first_air_date;
  const original_title = item.original_name;
  const poster = item.poster_url || "/placeholder.jpg";
  const backdrop = item.backdrop_url || item.poster_url || "/placeholder.jpg";
  const mediaType = "tv";

  // Check if we're using poster as backdrop (no backdrop available)
  const isUsingPosterAsBackdrop = !item.backdrop_url && item.poster_url;

  return (
    <div className="relative min-h-[calc(100vh-5.07rem)] mb-20">
      {/* 💠 Dynamic Background Blur */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed blur-2xl opacity-30"
        style={{
          backgroundImage: `url(${backdrop})`,
        }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="background-image"] {
              background-image: url(${poster}) !important;
            }
          }
        `}</style>
      </div>

      {/* 💠 Page Content */}
      <div className="flex flex-col items-center p-6 mt-5">
        {/* 💠 Responsive Poster/Backdrop */}
        <div className="mb-4">
          {/* Mobile: Poster */}
          <div className="block md:hidden">
            <Image
              src={poster}
              alt={title}
              className="object-cover mb-4 aspect-[2/3] rounded-2xl h-auto"
              width={400}
              height={600}
            />
          </div>

          {/* Desktop: Backdrop */}
          <div className="hidden md:block">
            <Image
              src={backdrop}
              alt={title}
              className={`object-cover mb-4 rounded-2xl shadow-xl ${isUsingPosterAsBackdrop
                  ? "aspect-[2/3] max-w-md mx-auto"
                  : "aspect-video"
                }`}
              width={isUsingPosterAsBackdrop ? 400 : 1080}
              height={isUsingPosterAsBackdrop ? 600 : 480}
            />
          </div>
        </div>

        {/* 💠 Description Box */}
        <div className="max-w-[1080px] w-full border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl mb-10">
          <div className="flex max-sm:flex-col items-center justify-between gap-5 mb-4 w-full">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-xl text-yellow-400">
                ⭐{" "}
                {typeof item.vote_average === "number"
                  ? item.vote_average.toFixed(1)
                  : "0.0"}
              </span>
              <WatchlistButton item={item} type="tv" showText />
            </div>
          </div>
          <p className="text-[#FFFFFF] mb-2 text-lg font-medium">
            {rDate.slice(0, 4)} | {item.adult ? "18+" : "+13"} |{" "}
            {item.genre_names[0] || "Unknown Genre"}
          </p>
          <p className="mb-2 text-white text-lg font-medium">
            {item.overview || "No description available."}
          </p>
        </div>

        {/* 💠 More Info Cards */}
        <div className="max-w-[1080px] w-full flex flex-col gap-6">
          <h2 className="text-[32px] font-bold text-white">More Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-2">
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Original Name</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{original_title || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Release Date</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{rDate || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Genre</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.genre_names?.join(", ") || "Unknown"}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-1">
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Original Language</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.original_language || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Subtitles</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">English</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-1">
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Popularity</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.popularity || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Rating</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.vote_average || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#FFFFFF] text-lg font-medium">Vote Count</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.vote_count || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Providers Section */}
        <div className="max-w-[1080px] w-full mt-6">
          {seriesId && <WatchProviders id={seriesId} mediaType="tv" />}
        </div>

        <div className="mt-10">
          {seriesId && <Cast movieId={seriesId} mediaType="tv" />}
        </div>

        {seriesId && <Recommendations movieId={String(seriesId)} type="tv" />}
        {seriesId && <MayLike movieId={String(seriesId)} type={mediaType} />}
        {seriesId && <TrendingNow title={"Now"} type={mediaType} isLarge={false} />}
      </div>
    </div>
  );
}

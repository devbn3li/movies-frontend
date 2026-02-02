"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { TVShow } from "@/types/index";
import { useEffect, useState } from "react";
import MayLike from "@/components/MayLike";
import TrendingNow from "@/components/TrendingNow";
import WatchlistButton from "@/components/WatchlistButton";
import Cast from "@/components/Cast";
import Loading from "@/components/Loading";
import Recommendations from "@/components/Recommendations";
import ShareDownloadButtons from "@/components/ShareDownloadButtons";
import Trailer from "@/components/Trailer";
import Reviews from "@/components/Reviews";
import SeasonEpisodeSelector, { SeasonSummary } from "@/components/SeasonEpisodeSelector";

// TMDB Season type
interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
  overview: string;
}

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
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: TMDBSeason[];
}

// Convert TMDB data to local format
const convertTMDBToLocal = (tmdbShow: TMDBTVShow): TVShow => ({
  id: tmdbShow.id,
  name: tmdbShow.name,
  original_name: tmdbShow.original_name,
  overview: tmdbShow.overview,
  first_air_date: tmdbShow.first_air_date,
  genre_names: tmdbShow.genres.map(g => g.name),
  poster_url: tmdbShow.poster_path ? `https://image.tmdb.org/t/p/w300${tmdbShow.poster_path}` : null,
  backdrop_url: tmdbShow.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbShow.backdrop_path}` : null,
  popularity: tmdbShow.popularity,
  vote_average: tmdbShow.vote_average,
  vote_count: tmdbShow.vote_count,
  original_language: tmdbShow.original_language,
  origin_country: tmdbShow.origin_country,
});

interface SeriesPageProps {
  seriesId: number;
}

export default function SeriesPage({ seriesId }: SeriesPageProps) {
  const [item, setItem] = useState<TVShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seasons, setSeasons] = useState<SeasonSummary[]>([]);

  useEffect(() => {
    if (!seriesId) {
      return;
    }

    const fetchSeriesData = async () => {
      setIsLoading(true);

      try {
        // Fetch series details directly from TMDB
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
          const convertedItem = convertTMDBToLocal(tmdbData);
          setItem(convertedItem);

          // Set seasons data
          if (tmdbData.seasons) {
            setSeasons(tmdbData.seasons.map(s => ({
              id: s.id,
              name: s.name,
              season_number: s.season_number,
              episode_count: s.episode_count,
              poster_path: s.poster_path,
              air_date: s.air_date,
            })));
          }
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error('Error fetching series data:', error);
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
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TVSeries",
            name: title,
            alternateName: original_title,
            description: item.overview,
            image: [poster, backdrop].filter(Boolean),
            datePublished: rDate,
            genre: item.genre_names,
            inLanguage: item.original_language,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: item.vote_average || 0,
              reviewCount: item.vote_count || 0,
              bestRating: 10,
              worstRating: 0,
            },
            url: typeof window !== 'undefined' ? window.location.href : `https://moviezone-inky.vercel.app/series/${seriesId}`,
            potentialAction: {
              "@type": "WatchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: typeof window !== 'undefined' ? window.location.href : `https://moviezone-inky.vercel.app/series/${seriesId}`,
              },
            },
            provider: {
              "@type": "Organization",
              name: "Movie Zone",
              url: "https://moviezone-inky.vercel.app",
            },
          }),
        }}
      />

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
              className="object-cover mb-4 aspect-2/3 rounded-2xl h-auto"
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
                ? "aspect-2/3 max-w-md mx-auto"
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
            {rDate.slice(0, 4)} | {item.genre_names[0] || "Unknown Genre"}
          </p>
          <p className="mb-4 text-white text-lg font-medium">
            {item.overview || "No description available."}
          </p>

          {/* Trailer and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Trailer
              id={item.id}
              mediaType="tv"
              title={title}
              size="lg"
            />
            <ShareDownloadButtons
              id={item.id}
              title={title}
              type="tv"
              overview={item.overview}
              releaseDate={rDate}
              rating={item.vote_average}
              posterUrl={poster}
            />
          </div>
        </div>

        {/* 💠 Season & Episode Selector */}
        {seasons.length > 0 && (
          <SeasonEpisodeSelector
            seriesId={seriesId}
            seasons={seasons}
          />
        )}

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

        <div className="mt-10">
          {seriesId && <Cast movieId={seriesId} mediaType="tv" />}
        </div>

        {seriesId && <Recommendations movieId={String(seriesId)} type="tv" />}
        {seriesId && <MayLike movieId={String(seriesId)} type={mediaType} />}
        {seriesId && <TrendingNow title={"Now"} type={mediaType} isLarge={false} />}
        {seriesId && <Reviews movieId={item?._id || String(seriesId)} mediaType="tv" />}
      </div>
    </div>
  );
}

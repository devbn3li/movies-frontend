"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import mediaData from "@/assets/moviesdb.json";
import { notFound } from "next/navigation";
import { TVShow } from "@/types/index";
import { useMemo } from "react";
import MayLike from "@/components/MayLike";
import TrendingNow from "@/components/TrendingNow";
import WatchlistButton from "@/components/WatchlistButton";

type Media = TVShow;

export default function SeriesPage() {
  const params = useParams();

  const seriesId = useMemo(() => {
    if (!params?.seriesId || Array.isArray(params.seriesId)) return null;
    return Number(params.seriesId);
  }, [params]);

  const { tv_shows } = mediaData as {
    tv_shows: TVShow[];
  };

  const all: Media[] = [...tv_shows];
  const item = all.find((m) => m.id === seriesId);

  if (!item) return notFound();

  const title = item.name;
  const rDate = item.first_air_date;
  const original_title = item.original_name;
  const poster = item.poster_url || "/placeholder.jpg";
  const backdrop = item.backdrop_url || poster;
  const mediaType = "tv";

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
              className="object-cover mb-4 aspect-video rounded-2xl shadow-xl"
              width={1080}
              height={480}
            />
          </div>
        </div>

        {/* 💠 Description Box */}
        <div className="max-w-[1080px] w-full border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl mb-10">
          <div className="flex items-center justify-between gap-5 mb-4 w-full">
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

        {seriesId && <MayLike movieId={String(seriesId)} type={mediaType} />}
        {seriesId && <TrendingNow title={"Now"} type={mediaType} isLarge={false} />}
      </div>
    </div>
  );
}

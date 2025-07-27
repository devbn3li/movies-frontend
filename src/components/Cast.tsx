"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CastMember, Credits } from "@/types/index";
import { getCredits } from "@/lib/api";
import { trackCastMemberClick } from "@/lib/analytics";

/**
 * Cast component displays cast and crew information for movies and TV shows
 * Fetches data from TMDB API and displays it in a responsive grid layout
 */
interface CastProps {
  movieId: number; // Can be movie ID or TV show ID
  mediaType: 'movie' | 'tv';
  movieTitle?: string; // Add movie title for analytics
}

export default function Cast({ movieId, mediaType, movieTitle = 'Unknown Title' }: CastProps) {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      setLoading(true);
      setError(null);
      try {
        const creditsData = await getCredits(movieId, mediaType);
        if (creditsData) {
          setCredits(creditsData);
        } else {
          setError('Failed to load cast information');
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
        setError('Failed to load cast information');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchCredits();
    }
  }, [movieId, mediaType]);

  if (loading) {
    return (
      <div className="max-w-[1080px] w-full">
        <h2 className="text-[32px] font-bold text-white mb-6">Cast & Crew</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white/20 rounded-2xl aspect-[2/3] mb-2"></div>
              <div className="bg-white/20 rounded h-4 mb-1"></div>
              <div className="bg-white/20 rounded h-3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1080px] w-full">
        <h2 className="text-[32px] font-bold text-white mb-6">Cast & Crew</h2>
        <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
          <p className="text-[#FFFFFFB3] text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!credits || !credits.cast || credits.cast.length === 0) {
    return null;
  }

  const displayedCast = showAll ? credits.cast : credits.cast.slice(0, 12);
  const director = credits.crew?.find(member => member.job === 'Director');
  const creator = credits.crew?.find(member => member.job === 'Creator' || member.job === 'Executive Producer');
  const keyCrewMember = director || creator;

  // Simple placeholder data URL for missing avatars
  const placeholderAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg1IiBoZWlnaHQ9IjI3OCIgdmlld0JveD0iMCAwIDE4NSAyNzgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PC9kZWZzPjxyZWN0IHdpZHRoPSIxODUiIGhlaWdodD0iMjc4IiByeD0iMTYiIGZpbGw9IiM0QjU1NjMiLz48Y2lyY2xlIGN4PSI5Mi41IiBjeT0iMTAwIiByPSIzNSIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik05Mi41IDE1MEM3MCAxNTAgNDUgMTY1IDQ1IDE4NVYyMjBIMTQwVjE4NUM0MCAxNjUgMTE1IDE1MCA5Mi41IDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=";

  return (
    <div className="max-w-[1080px] w-full">
      <h2 className="text-[32px] font-bold text-white mb-6">Cast & Crew</h2>

      {/* Director/Creator Info */}
      {keyCrewMember && (
        <div className="mb-6 border border-white/20 p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-4">
            {keyCrewMember.profile_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w185${keyCrewMember.profile_path}`}
                alt={keyCrewMember.name}
                width={60}
                height={90}
                className="rounded-lg object-cover aspect-[2/3]"
              />
            )}
            <div>
              <p className="text-white text-lg font-medium">
                {mediaType === 'movie' ? 'Director' : keyCrewMember.job}
              </p>
              <p className="text-[#FFFFFFB3] text-xl font-bold">{keyCrewMember.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {displayedCast.map((castMember: CastMember, index: number) => (
          <Link
            href={`/person/${castMember.id}`}
            key={`${castMember.id}-${index}`}
            className="text-center group cursor-pointer"
            onClick={() => trackCastMemberClick(castMember.name, movieTitle)}
          >
            <div className="relative mb-2">
              <Image
                src={
                  castMember.profile_path
                    ? `https://image.tmdb.org/t/p/w185${castMember.profile_path}`
                    : placeholderAvatar
                }
                alt={castMember.name}
                width={185}
                height={278}
                className="w-full rounded-2xl object-cover aspect-[2/3] border border-white/20 bg-white/10 backdrop-blur-md shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderAvatar;
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <div className="text-white text-center p-2">
                  <p className="text-sm font-semibold">View Profile</p>
                </div>
              </div>
            </div>
            <h3 className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors duration-200">
              {castMember.name}
            </h3>
            <p className="text-[#FFFFFFB3] text-xs truncate">{castMember.character}</p>
          </Link>
        ))}
      </div>

      {/* Show More/Less Button */}
      {credits.cast.length > 12 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded-2xl text-white font-medium transition-all duration-200 backdrop-blur-md"
          >
            {showAll ? 'Show Less' : `Show All Cast (${credits.cast.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

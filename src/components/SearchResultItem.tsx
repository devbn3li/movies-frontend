"use client";

import { memo } from "react";
import { Film, Tv, User, Search } from "lucide-react";
import Image from "next/image";
import { containsSensitiveContent } from "@/lib/utils";
import { trackSearchResultClick } from "@/lib/analytics";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  profile_path?: string;
  media_type?: "movie" | "tv" | "person";
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
  adult?: boolean;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  original_name?: string;
  original_title?: string;
  genre_ids?: number[];
  origin_country?: string[];
  original_language?: string;
}

interface SearchResultItemProps {
  result: SearchResult;
  index: number;
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
}

const getMediaIcon = (mediaType?: string) => {
  switch (mediaType) {
    case "movie":
      return <Film className="h-4 w-4 text-blue-400" />;
    case "tv":
      return <Tv className="h-4 w-4 text-green-400" />;
    case "person":
      return <User className="h-4 w-4 text-purple-400" />;
    default:
      return <Search className="h-4 w-4 text-gray-400" />;
  }
};

const getYear = (result: SearchResult) => {
  const date = result.release_date || result.first_air_date;
  return date ? new Date(date).getFullYear() : "";
};

const isAdultContent = (result: SearchResult) => {
  const title = result.title || result.name || "";
  return result.adult || containsSensitiveContent(title);
};

export const SearchResultItem = memo<SearchResultItemProps>(function SearchResultItem({
  result,
  index,
  selectedIndex,
  onResultClick
}) {
  const handleClick = () => {
    // Track Analytics event
    const title = result.title || result.name || 'Unknown';
    trackSearchResultClick(title, result.id, index + 1);
    
    // Call the original click handler
    onResultClick(result);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group ${index === selectedIndex ? "bg-white/20" : "hover:bg-white/10"
        }`}
    >
      <div className="flex-shrink-0">
        {getMediaIcon(result.media_type)}
      </div>

      {(result.poster_path || result.profile_path) && (
        <div className="flex-shrink-0 w-12 h-16 relative rounded overflow-hidden bg-gray-800">
          <Image
            src={`https://image.tmdb.org/t/p/w92${result.poster_path || result.profile_path}`}
            alt={result.title || result.name || ""}
            fill
            className="object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
            sizes="48px"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 text-left">
        <h3 className="text-white font-medium truncate text-left">
          {result.title || result.name}
        </h3>
        <p className="text-white/60 text-sm capitalize flex items-center gap-1 text-left">
          {result.media_type}
          {isAdultContent(result) && (
            <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
              18+
            </span>
          )}
          {result.known_for_department && ` • ${result.known_for_department}`}
          {getYear(result) && ` • ${getYear(result)}`}
          {result.vote_average && result.vote_average > 0 && (
            <span className="text-yellow-400">⭐ {result.vote_average.toFixed(1)}</span>
          )}
        </p>
        {result.overview && (
          <p className="text-white/50 text-xs mt-1 truncate text-left">
            {result.overview}
          </p>
        )}
      </div>
    </div>
  );
});

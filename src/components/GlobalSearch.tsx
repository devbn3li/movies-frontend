"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, Film, Tv, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup timeout on unmount
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const searchMulti = async (searchQuery: string, page: number = 1, appendResults: boolean = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMoreResults(false);
      return;
    }

    if (appendResults) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const bearerToken = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      if (!bearerToken) {
        throw new Error('TMDB API key not found');
      }

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${bearerToken}`
        }
      };

      const encodedQuery = encodeURIComponent(searchQuery);

      // Use single multi-search endpoint with pagination
      const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodedQuery}&include_adult=true&language=en-US&page=${page}`, options);
      const data = await response.json();

      // Format results
      const newResults: SearchResult[] = [];

      if (data.results) {
        data.results.forEach((result: SearchResult) => {
          // Ensure media_type is set correctly
          if (result.media_type === 'movie' || result.media_type === 'tv' || result.media_type === 'person') {
            newResults.push(result);
          }
        });
      }

      // Update pagination info
      setCurrentPage(page);
      setTotalPages(data.total_pages || 1);
      setHasMoreResults(page < (data.total_pages || 1));

      // Sort by popularity
      const sortedResults = newResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      if (appendResults) {
        // Append to existing results
        setResults(prev => [...prev, ...sortedResults]);
      } else {
        // Replace results
        setResults(sortedResults);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to mock data if API fails
      const mockResults: SearchResult[] = [
        {
          id: 1,
          title: "The Dark Knight",
          overview: "Batman raises the stakes in his war on crime...",
          poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          media_type: "movie" as const,
          release_date: "2008-07-18",
          popularity: 85.5
        },
        {
          id: 2,
          name: "Breaking Bad",
          overview: "A high school chemistry teacher turned meth cook...",
          poster_path: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
          media_type: "tv" as const,
          first_air_date: "2008-01-20",
          popularity: 92.3
        },
        {
          id: 3,
          name: "Christian Bale",
          known_for_department: "Acting",
          profile_path: "/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg",
          media_type: "person" as const,
          popularity: 75.8
        }
      ].filter(item =>
        (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (appendResults) {
        setResults(prev => [...prev, ...mockResults]);
      } else {
        setResults(mockResults);
      }
      setHasMoreResults(false);
    } finally {
      if (appendResults) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.trim()) {
      setIsOpen(true);
      setIsLoading(true);

      // Reset pagination when starting new search
      setCurrentPage(1);
      setHasMoreResults(false);

      // Debounce search requests
      debounceTimeoutRef.current = setTimeout(() => {
        searchMulti(value, 1, false);
      }, 300);
    } else {
      setIsOpen(false);
      setResults([]);
      setIsLoading(false);
      setCurrentPage(1);
      setHasMoreResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const title = result.title || result.name || "";
    setQuery(title);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Navigate to the appropriate page
    if (result.media_type === "movie") {
      window.location.href = `/movie/${result.id}`;
    } else if (result.media_type === "tv") {
      window.location.href = `/series/${result.id}`;
    } else if (result.media_type === "person") {
      window.location.href = `/person/${result.id}`;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setCurrentPage(1);
    setHasMoreResults(false);
    inputRef.current?.focus();
  };

  const loadMoreResults = () => {
    if (hasMoreResults && !isLoadingMore && query.trim()) {
      const nextPage = currentPage + 1;
      searchMulti(query, nextPage, true);
    }
  };

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

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies, TV shows, people..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setIsOpen(true)}
            className="pl-16 pr-16 py-6 text-xl bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-white/40 rounded-full w-full"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-h-96 overflow-y-auto overflow-x-hidden"
            style={{ zIndex: 9999 }}
          >
            {isLoading ? (
              <div className="p-6 text-center text-white/60">
                <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-3"></div>
                <p className="text-sm">Searching movies, TV shows & people...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2 overflow-x-hidden">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.media_type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${index === selectedIndex
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                      }`}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.2 }}
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
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-white font-medium truncate text-left">
                        {result.title || result.name}
                      </h3>
                      <p className="text-white/60 text-sm capitalize flex items-center gap-1 text-left">
                        {result.media_type}
                        {result.adult && (
                          <span className="text-white text-sm">• 18+</span>
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
                  </motion.div>
                ))}

                {/* Load More Button */}
                {hasMoreResults && (
                  <div className="p-4 border-t border-white/10">
                    <button
                      onClick={loadMoreResults}
                      disabled={isLoadingMore}
                      className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white/60 rounded-full"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Results
                          <span className="text-white/60">({currentPage}/{totalPages})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center text-white/60">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

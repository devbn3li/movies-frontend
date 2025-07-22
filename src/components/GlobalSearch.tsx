"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAdultContentFilter } from "@/hooks/useAdultContentFilter";
import { containsSensitiveContent } from "@/lib/utils";
import { trackSearch } from "@/lib/analytics";
import { SearchResultItem } from "./SearchResultItem";
import { LoadingSpinner, LoadMoreButton } from "./SearchComponents";

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
  const { isAdmin } = useAuth();
  const { hideAdultContent, refreshFromStorage } = useAdultContentFilter();
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

  // Cache for search results to avoid duplicate API calls
  const searchCacheRef = useRef<Map<string, { results: SearchResult[], timestamp: number }>>(new Map());

  // Memoize filtered results for better performance
  const { filteredResults, hiddenCount } = useMemo(() => {
    if (results.length === 0) {
      return { filteredResults: [], hiddenCount: 0 };
    }

    const filtered = results.filter((result) => {
      const isSensitive = result.adult || containsSensitiveContent(result.title || result.name || "");

      // If admin, ignore hiding regardless of settings
      if (isAdmin) {
        return true;
      }

      // If hideAdultContent is enabled and content is sensitive, hide it
      if (hideAdultContent && isSensitive) {
        return false;
      }

      return true;
    });

    return {
      filteredResults: filtered,
      hiddenCount: results.length - filtered.length
    };
  }, [results, hideAdultContent, isAdmin]);

  const handleResultClick = useCallback((result: SearchResult) => {
    const title = result.title || result.name || "";
    setQuery(title);
    setIsOpen(false);
    setSelectedIndex(-1);

    if (result.media_type === "movie") {
      window.location.href = `/movie/${result.id}`;
    } else if (result.media_type === "tv") {
      window.location.href = `/series/${result.id}`;
    } else if (result.media_type === "person") {
      window.location.href = `/person/${result.id}`;
    }
  }, []);

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
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || filteredResults.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(filteredResults[selectedIndex]);
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
  }, [isOpen, filteredResults, selectedIndex, handleResultClick]);

  const searchMulti = useCallback(async (searchQuery: string, page: number = 1, appendResults: boolean = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMoreResults(false);
      return;
    }

    // Check cache first (valid for 5 minutes)
    const cacheKey = `${searchQuery}_${page}`;
    const cached = searchCacheRef.current.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < 300000) { // 5 minutes
      const sortedResults = cached.results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      if (appendResults) {
        setResults(prev => [...prev, ...sortedResults]);
      } else {
        setResults(sortedResults);
      }
      setHasMoreResults(page < totalPages);
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
      const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodedQuery}&include_adult=true&language=en-US&page=${page}`, options);
      const data = await response.json();

      const newResults: SearchResult[] = [];

      if (data.results) {
        data.results.forEach((result: SearchResult) => {
          if (result.media_type === 'movie' || result.media_type === 'tv' || result.media_type === 'person') {
            newResults.push(result);
          }
        });
      }

      // Cache the results
      searchCacheRef.current.set(cacheKey, {
        results: newResults,
        timestamp: now
      });

      setCurrentPage(page);
      setTotalPages(data.total_pages || 1);
      setHasMoreResults(page < (data.total_pages || 1));

      const sortedResults = newResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      if (appendResults) {
        setResults(prev => [...prev, ...sortedResults]);
      } else {
        setResults(sortedResults);
        // Track search event only for new searches (not pagination)
        trackSearch(searchQuery, sortedResults.length);
      }
    } catch (error) {
      console.error("Search error:", error);
      setHasMoreResults(false);
    } finally {
      if (appendResults) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [totalPages]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.trim()) {
      setIsOpen(true);
      setIsLoading(true);
      setCurrentPage(1);
      setHasMoreResults(false);

      debounceTimeoutRef.current = setTimeout(() => {
        searchMulti(value, 1, false);
      }, 200); // Reduced from 300ms to 200ms for faster response
    } else {
      setIsOpen(false);
      setResults([]);
      setIsLoading(false);
      setCurrentPage(1);
      setHasMoreResults(false);
    }
  }, [searchMulti]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setCurrentPage(1);
    setHasMoreResults(false);
    inputRef.current?.focus();
  }, []);

  const loadMoreResults = useCallback(() => {
    if (hasMoreResults && !isLoadingMore && query.trim()) {
      const nextPage = currentPage + 1;
      searchMulti(query, nextPage, true);
    }
  }, [hasMoreResults, isLoadingMore, query, currentPage, searchMulti]);

  // Function to check localStorage and re-filter results when needed
  const handleFocus = useCallback(() => {
    // Refresh adult content setting from localStorage
    refreshFromStorage();

    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query, refreshFromStorage]);

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies, TV shows, people..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
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
          <div
            className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-h-96 overflow-y-auto overflow-x-hidden"
            style={{ zIndex: 9999 }}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : results.length > 0 ? (
              <div className="py-2 overflow-x-hidden">
                {hiddenCount > 0 && (
                  <div className="px-4 py-2 mb-2 bg-amber-600/20 border border-amber-600/30 rounded-lg mx-2">
                    <p className="text-amber-200 text-sm text-center">
                      {hiddenCount} result{hiddenCount > 1 ? 's' : ''} hidden due to your content settings.{' '}
                      <span className="font-medium">Go to Settings to change this.</span>
                    </p>
                  </div>
                )}

                {filteredResults.map((result, index) => (
                  <SearchResultItem
                    key={`${result.media_type}-${result.id}-${index}`}
                    result={result}
                    index={index}
                    selectedIndex={selectedIndex}
                    onResultClick={handleResultClick}
                  />
                ))}

                {hasMoreResults && (
                  <LoadMoreButton
                    onClick={loadMoreResults}
                    isLoading={isLoadingMore}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                )}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center text-white/60">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { TVShow } from "@/types/index";
import FilterBar, { FilterOptions } from "@/components/common/FilterBar/FilterBar";
import ResultsCount from "@/components/common/ResultsCount/ResultsCount";
import { useAuth } from "@/hooks/useAuth";
import { CompactTrailer } from "@/components/Trailer";
import { getTVShows, getTVGenres, getTVYears } from "@/lib/api";
import { Genre } from "@/types/index";
import Loading from "@/components/Loading";

const ITEMS_PER_PAGE = 24;

function TVShowsContent() {
  const searchParams = useSearchParams();
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: "default" });
  const [totalPages, setTotalPages] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { isAdmin } = useAuth();

  // Initialize filters from URL parameters
  useEffect(() => {
    const genreFromUrl = searchParams.get('genre');
    if (genreFromUrl) {
      setFilters(prev => ({
        ...prev,
        genre: genreFromUrl
      }));
    }
  }, [searchParams]);

  // Load available genres and years
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [genres, years] = await Promise.all([
          getTVGenres(),
          getTVYears(),
        ]);
        setAvailableGenres(genres);
        setAvailableYears(years);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // تحميل المسلسلات عندما تتغير الفلاتر أو البحث
    const loadData = async () => {
      try {
        setIsLoading(true);

        const params: {
          page?: number;
          limit?: number;
          search?: string;
          genre?: string;
          year?: number;
          sort_by?: string;
          order?: string;
          country?: string;
        } = {
          page: 1,
          limit: ITEMS_PER_PAGE,
        };

        // Add search parameter
        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        // Add filter parameters
        if (filters.genre && filters.genre !== "all") {
          params.genre = filters.genre;
        }

        if (filters.year && filters.year !== "all") {
          params.year = parseInt(filters.year);
        }

        if (filters.sortBy && filters.sortBy !== "default") {
          switch (filters.sortBy) {
            case "title":
              params.sort_by = "name";
              params.order = "asc";
              break;
            case "release_date":
              params.sort_by = "first_air_date";
              params.order = "desc";
              break;
            case "rating":
              params.sort_by = "vote_average";
              params.order = "desc";
              break;
            case "popularity":
              params.sort_by = "popularity";
              params.order = "desc";
              break;
          }
        }

        const response = await getTVShows(params);

        if (response) {
          setTvShows(response.tvShows || []);
          setTotalPages(response.totalPages || 0);
          setTotalShows(response.totalShows || 0);
        }
        setPage(1);
      } catch (error) {
        console.error('Error loading TV shows:', error);
        setTvShows([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, debouncedSearch, isAdmin]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePageChange = async (newPage: number) => {
    try {
      setIsLoading(true);
      setPage(newPage);

      const params: {
        page?: number;
        limit?: number;
        search?: string;
        genre?: string;
        year?: number;
        sort_by?: string;
        order?: string;
        country?: string;
      } = {
        page: newPage,
        limit: ITEMS_PER_PAGE,
      };

      // Add search parameter
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      // Add filter parameters
      if (filters.genre && filters.genre !== "all") {
        params.genre = filters.genre;
      }

      if (filters.year && filters.year !== "all") {
        params.year = parseInt(filters.year);
      }

      if (filters.sortBy && filters.sortBy !== "default") {
        switch (filters.sortBy) {
          case "title":
            params.sort_by = "name";
            params.order = "asc";
            break;
          case "release_date":
            params.sort_by = "first_air_date";
            params.order = "desc";
            break;
          case "rating":
            params.sort_by = "vote_average";
            params.order = "desc";
            break;
          case "popularity":
            params.sort_by = "popularity";
            params.order = "desc";
            break;
        }
      }

      const response = await getTVShows(params);

      if (response) {
        setTvShows(response.tvShows || []);
        setTotalPages(response.totalPages || 0);
        setTotalShows(response.totalShows || 0);
      }
    } catch (error) {
      console.error('Error loading TV shows:', error);
      setTvShows([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract genres and years from available filters
  const genres: string[] = availableGenres.map(genre => genre.name);
  const years: string[] = availableYears;

  return (
    <div className="p-5 sm:px-20 pb-20 flex flex-col pt-15">
      <div className="flex w-full justify-center items-center mb-4">
        <Input
          placeholder="Search TV shows..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="sm:mx-25"
          type="search"
          autoComplete="on"
          disabled={isLoading}
        />
      </div>

      <div className="sm:mx-25">
        <FilterBar
          onFilterChange={handleFilterChange}
          genres={genres}
          years={years}
          disabled={isLoading}
          initialFilters={filters}
        />

        <ResultsCount
          total={totalShows}
          filtered={tvShows.length}
          isLoading={isLoading}
          itemType="series"
        />
      </div>

      <CardsGrid items={tvShows} isLoading={isLoading} />
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center w-full mt-8">
          <Pagination className="w-full max-w-3xl">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const newPage = page - 1;
                      handlePageChange(newPage);
                    }}
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const shouldShow =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - page) <= 1;
                const isEllipsisBefore = pageNum === page - 2 && pageNum !== 1;
                const isEllipsisAfter = pageNum === page + 2 && pageNum !== totalPages;

                if (isEllipsisBefore || isEllipsisAfter) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNum}`}>
                      <span className="text-gray-500 px-2">...</span>
                    </PaginationItem>
                  );
                }

                if (!shouldShow) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const newPage = page + 1;
                      handlePageChange(newPage);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {!isLoading && tvShows.length === 0 && (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 text-lg">No TV shows found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function CardsGrid({
  items,
  isLoading,
}: {
  items: TVShow[];
  isLoading: boolean;
}) {
  const { isAdmin } = useAuth();

  // Helper functions
  const getYear = (tvShow: TVShow) => {
    return tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : null;
  };

  const getRating = (vote_average: number | undefined) => {
    if (!vote_average) return null;
    return (vote_average / 2).toFixed(1);
  };

  const getBadge = (tvShow: TVShow) => {
    if (!tvShow.vote_average) return null;

    if (tvShow.vote_average >= 8) return { text: "High Rated", color: "bg-yellow-500" };
    if (tvShow.popularity && tvShow.popularity >= 1000) return { text: "Popular", color: "bg-red-500" };

    if (tvShow.first_air_date) {
      const releaseYear = new Date(tvShow.first_air_date).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - releaseYear <= 1) return { text: "New", color: "bg-green-500" };
    }

    return null;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div
          className="grid justify-center sm:px-20 pb-20"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            width: "100%",
          }}
        >
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col justify-center items-center bg-white dark:bg-black rounded-lg p-3 mx-auto"
            >
              <Skeleton className="rounded-2xl h-[345px] w-[230px] mb-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className="grid justify-center sm:px-20 pb-20"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          width: "100%",
        }}
      >
        {items
          .filter((item) => !!item.poster_url)
          .map((item) => (
            <Link
              href={`/series/${item.id}`}
              key={item.id}
              className="flex flex-col justify-center items-center bg-white dark:bg-black rounded-lg p-3 mx-auto"
            >
              <div className="relative group overflow-hidden rounded-2xl">
                {/* Badge */}
                {(() => {
                  const badge = getBadge(item);
                  return badge && (
                    <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-xs font-bold text-white ${badge.color}`}>
                      {badge.text}
                    </div>
                  );
                })()}

                {/* Rating */}
                {item.vote_average ? (
                  <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-white text-xs font-semibold">{getRating(item.vote_average)}</span>
                  </div>
                ) : null}

                <Image
                  src={item.poster_url || "/placeholder.jpg"}
                  alt={item.name || "TV Show"}
                  width={230}
                  height={340}
                  className="rounded-2xl object-cover h-auto mb-2 transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                />

                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                {/* Enhanced Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Year and Genre */}
                  <div className="flex items-center gap-2 mb-2">
                    {getYear(item) && (
                      <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                        {getYear(item)}
                      </span>
                    )}
                    {item.genre_names && item.genre_names[0] && (
                      <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded">
                        {item.genre_names[0]}
                      </span>
                    )}
                  </div>

                  {/* Overview */}
                  {item.overview && (
                    <p className="text-white/70 text-sm line-clamp-2 leading-relaxed mb-3">
                      {truncateText(item.overview, 100)}
                    </p>
                  )}

                  {/* Trailer Button */}
                  <div className="flex justify-center" onClick={(e) => e.preventDefault()}>
                    <CompactTrailer
                      id={item.id}
                      mediaType="tv"
                      title={item.name || ""}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default function TVShowsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TVShowsContent />
    </Suspense>
  );
}

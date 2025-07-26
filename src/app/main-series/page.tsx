"use client";
import { useState, useEffect } from "react";
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
import seriesData from "@/assets/tv.json";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { TVShow } from "@/types/index";
import Loading from "@/components/Loading";
import FilterBar from "@/components/common/FilterBar/FilterBar";
import { FilterOptions } from "@/components/common/FilterBar/FilterBar";
import { useFilteredData, extractGenres, extractYears } from "@/hooks/useFilteredData";
import ResultsCount from "@/components/common/ResultsCount/ResultsCount";
import { containsSensitiveContent } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 24;

// مكون منفصل للمحتوى اللي بيستخدم useSearchParams
function TVShowsContent() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: "default" });
  const { isAdmin } = useAuth(); // إضافة التحقق من صلاحيات الأدمن
  const searchParams = useSearchParams();

  // Simulate loading data (since moviesdb.json is static)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTvShows(seriesData as TVShow[]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // قراءة معاملات URL وتطبيق الفلاتر
  useEffect(() => {
    const genre = searchParams.get('genre');
    if (genre) {
      setFilters(prev => ({
        ...prev,
        genre: genre
      }));
    }
  }, [searchParams]);

  const data = tvShows;
  const { filteredAndSorted: filtered, hiddenCount } = useFilteredData(data, search, filters, isAdmin);
  const genres = extractGenres(data);
  const years = extractYears(data);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="p-5 sm:px-20 pb-20 flex flex-col pt-15">
      <div className="flex w-full justify-center items-center mb-4 gap-5">
        <Input
          placeholder="Search series..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:mx-25"
          type="search"
          autoComplete="on"
          disabled={isLoading}
        />
      </div>
      <div className="sm:mx-25">      <FilterBar
        onFilterChange={handleFilterChange}
        genres={genres}
        years={years}
        disabled={isLoading}
        showAdultFilter={isAdmin} // إظهار فلتر Adult فقط للأدمن
      />

        <ResultsCount
          total={data.length}
          filtered={filtered.length}
          isLoading={isLoading}
          itemType="series"
        />

        {hiddenCount > 0 && !isLoading && (
          <div className="mt-2 text-center">
            <p className="text-amber-200 text-sm bg-amber-600/20 border border-amber-600/30 rounded-lg px-4 py-2 inline-block">
              {hiddenCount} series{hiddenCount > 1 ? '' : ''} hidden due to your content settings.{' '}
              <span className="font-medium">Go to Settings to change this.</span>
            </p>
          </div>
        )}</div>


      <CardsGrid items={paginated} type="tv" isLoading={isLoading} />


      {!isLoading && filtered.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center w-full mt-8">
          <Pagination className="w-full max-w-3xl">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => setPage(page - 1)} />
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
                      <span className="px-2 text-gray-500">...</span>
                    </PaginationItem>
                  );
                }

                if (!shouldShow) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => setPage(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 text-lg">No series found matching your criteria</p>
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
  type: "tv";
  isLoading: boolean;
}) {
  const { isAdmin } = useAuth(); // إضافة التحقق من صلاحيات الأدمن

  // Helper functions
  const getYear = (show: TVShow) => {
    return show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;
  };

  const getRating = (vote_average: number | undefined) => {
    if (!vote_average) return null;
    return (vote_average / 2).toFixed(1);
  };

  const getBadge = (show: TVShow) => {
    // Priority: Adult content first
    if (show.adult) {
      return { text: "18+", color: "bg-red-600" };
    }

    // التحقق من المحتوى الحساس في العنوان
    if (containsSensitiveContent(show.name)) {
      return { text: "Sensitive", color: "bg-orange-600" };
    }

    if (!show.vote_average) return null;

    if (show.vote_average >= 8) return { text: "High Rated", color: "bg-yellow-500" };
    if (show.popularity && show.popularity >= 1000) return { text: "Popular", color: "bg-red-500" };

    if (show.first_air_date) {
      const releaseYear = new Date(show.first_air_date).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - releaseYear <= 1) return { text: "New", color: "bg-green-500" };
    }

    return null;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };
  if (!items) {
    return <Loading />;
  }

  if (isLoading) {
    // Render 12 skeleton cards to match ITEMS_PER_PAGE
    return (
      <div className="w-full flex justify-center">
        <div
          className="grid gap-6 justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            width: "100%",
          }}
        >
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col justify-center items-center bg-white dark:bg-black rounded-lg p-3 mx-auto"
            >
              <Skeleton className="rounded h-[345px] w-[230px] mb-2" />
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
        {items.filter((item) => !!item.poster_url).map((item) => (
          <Link
            href={`/series/${item.id}`}
            key={item.id}
            className="flex flex-col justify-center items-center bg-white dark:bg-black rounded-lg p-3 mx-auto"
          >
            <div className="relative group overflow-hidden rounded-2xl">
              {/* Badge */}
              {getBadge(item) && (
                <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-xs font-bold text-white ${getBadge(item)?.color}`}>
                  {getBadge(item)?.text}
                </div>
              )}

              {/* Rating */}
              {item.vote_average ? (
                <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span className="text-white text-xs font-semibold">{getRating(item.vote_average)}</span>
                </div>
              ) : null}

              <Image
                src={item.poster_url || "/placeholder.jpg"}
                alt={item.name}
                width={230}
                height={340}
                className={`rounded-2xl object-cover h-auto mb-2 transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 ${!isAdmin && (item.adult || containsSensitiveContent(item.name))
                    ? 'blur-sm group-hover:blur-none'
                    : ''
                  }`}
              />

              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

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
                  <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                    {truncateText(item.overview, 100)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TVShowsPage() {
  return <TVShowsContent />;
}
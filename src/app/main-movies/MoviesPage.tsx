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
import moviesData from "@/assets/movies.json";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie } from "@/types/index";

const ITEMS_PER_PAGE = 24;

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMovies(moviesData as Movie[]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filtered = movies.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-5 sm:px-20 pb-20 flex flex-col pt-15">
      <div className="flex w-full justify-center items-center mb-4 gap-5">
        <Input
          placeholder="Search..."
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

      <CardsGrid items={paginated} isLoading={isLoading} />
      {!isLoading && filtered.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center w-full">
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
    </div>
  );
}

function CardsGrid({
  items,
  isLoading,
}: {
  items: Movie[];
  isLoading: boolean;
}) {
  if (isLoading) {
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
              <Skeleton className="rounded h-[450px] w-[330px] mb-2" />
              <Skeleton className="w-24 h-4 mt-2" />
              <Skeleton className="w-10 h-4 mt-2" />
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
        className="grid justify-center px-20 pb-20"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          width: "100%",
        }}
      >
        {items
          .filter((item) => !!item.poster_url)
          .map((item) => (
            <Link
              href={`/movie/${item.id}`}
              key={item.id}
              className="flex flex-col justify-center items-center bg-white dark:bg-black rounded-lg p-3 mx-auto"
            >
              <div className="relative group overflow-hidden rounded-2xl">
                <Image
                  src={item.poster_url}
                  alt={item.title}
                  width={230}
                  height={340}
                  className="rounded-2xl object-cover h-auto mb-2 transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
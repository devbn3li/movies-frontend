"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Filter, X } from "lucide-react";

export type FilterOptions = {
  sortBy: "popularity" | "rating" | "release_date" | "title" | "default";
  year?: string;
  genre?: string;
  minRating?: number;
  includeAdult?: boolean;
};

export type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  genres: string[];
  years: string[];
  disabled?: boolean;
  showAdultFilter?: boolean;
};

export default function FilterBar({ onFilterChange, genres, years, disabled = false, showAdultFilter = false }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: "default" });

  const updateFilter = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = { sortBy: "default" };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.sortBy !== "default" || filters.year || filters.genre || filters.minRating || filters.includeAdult;

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "popularity", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "release_date", label: "Latest Release" },
    { value: "title", label: "Title A-Z" },
  ];

  const ratingOptions = [
    { value: undefined, label: "All Ratings" },
    { value: 7, label: "7+ Stars" },
    { value: 8, label: "8+ Stars" },
    { value: 9, label: "9+ Stars" },
  ];

  return (
    <div className="flex max-sm:flex-col  gap-4 mb-6 p-4  rounded-lg border dark:border-[#333333]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Filter size={16} />
          <span>Filters</span>
        </div>

        {/* Clear Filters - Mobile */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 md:hidden"
            disabled={disabled}
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort By */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" size="sm" className="h-8 min-w-[100px] justify-between">
              <span className="truncate">
                {sortOptions.find(option => option.value === filters.sortBy)?.label || "Sort By"}
              </span>
              <ChevronDown size={14} className="ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("sortBy", option.value)}
                className={filters.sortBy === option.value ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" size="sm" className="h-8 min-w-[80px] justify-between">
              <span className="truncate">{filters.year || "Year"}</span>
              <ChevronDown size={14} className="ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto" align="start">
            <DropdownMenuItem onClick={() => updateFilter("year", undefined)}>
              All Years
            </DropdownMenuItem>
            {years.slice(0, 20).map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => updateFilter("year", year)}
                className={filters.year === year ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Genre */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" size="sm" className="h-8 min-w-[80px] justify-between">
              <span className="truncate">{filters.genre || "Genre"}</span>
              <ChevronDown size={14} className="ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto" align="start">
            <DropdownMenuItem onClick={() => updateFilter("genre", undefined)}>
              All Genres
            </DropdownMenuItem>
            {genres.map((genre) => (
              <DropdownMenuItem
                key={genre}
                onClick={() => updateFilter("genre", genre)}
                className={filters.genre === genre ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                {genre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Rating */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" size="sm" className="h-8 min-w-[80px] justify-between">
              <span className="truncate">
                {filters.minRating ? `${filters.minRating}+ Stars` : "Rating"}
              </span>
              <ChevronDown size={14} className="ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ratingOptions.map((option) => (
              <DropdownMenuItem
                key={option.value || "all"}
                onClick={() => updateFilter("minRating", option.value)}
                className={filters.minRating === option.value ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Adult Content Filter - Only for Admins */}
        {showAdultFilter && (
          <div className="flex items-center space-x-2 px-3 py-2 border rounded-md">
            <Switch
              id="adult-content"
              checked={filters.includeAdult || false}
              onCheckedChange={(checked) => updateFilter("includeAdult", checked)}
              disabled={disabled}
            />
            <label
              htmlFor="adult-content"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Adult Content
            </label>
          </div>
        )}

        {/* Clear Filters - Desktop */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 hidden md:flex"
            disabled={disabled}
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        )}

        {/* Active filters count - Desktop */}
        {hasActiveFilters && (
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 hidden md:block">
            {Object.values(filters).filter(v => v && v !== "default").length} filter(s) active
          </div>
        )}
      </div>

      {/* Active filters count - Mobile */}
      {hasActiveFilters && (
        <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden text-center">
          {Object.values(filters).filter(v => v && v !== "default").length} filter(s) active
        </div>
      )}
    </div>
  );
}

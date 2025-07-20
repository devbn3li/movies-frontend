import { useMemo } from "react";
import { Movie, TVShow } from "@/types";
import { FilterOptions } from "@/components/common/FilterBar/FilterBar";
import { containsSensitiveContent } from "@/lib/utils";

type MediaItem = Movie | TVShow;

export function useFilteredData<T extends MediaItem>(
  data: T[],
  searchQuery: string,
  filters: FilterOptions
) {
  const filteredAndSorted = useMemo(() => {
    if (!data.length) return [];

    let filtered = data.filter((item) => {
      // Search filter
      const title = "title" in item ? item.title : item.name;
      const matchesSearch = title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Year filter
      if (filters.year) {
        const releaseDate =
          "release_date" in item ? item.release_date : item.first_air_date;
        if (releaseDate) {
          const itemYear = new Date(releaseDate).getFullYear().toString();
          if (itemYear !== filters.year) return false;
        }
      }

      // Genre filter
      if (filters.genre) {
        if (!item.genre_names || !item.genre_names.includes(filters.genre)) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating) {
        if (!item.vote_average || item.vote_average < filters.minRating) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (filters.sortBy && filters.sortBy !== "default") {
      if (filters.sortBy === "adult") {
        // Filter for adult content and sensitive content
        filtered = filtered.filter((item) => {
          const title = "title" in item ? item.title : item.name;
          return item.adult || containsSensitiveContent(title);
        });
      } else {
        // Apply normal sorting
        filtered = [...filtered].sort((a, b) => {
          switch (filters.sortBy) {
            case "popularity":
              return (b.popularity || 0) - (a.popularity || 0);

            case "rating":
              return (b.vote_average || 0) - (a.vote_average || 0);

            case "release_date": {
              const dateA =
                "release_date" in a ? a.release_date : a.first_air_date;
              const dateB =
                "release_date" in b ? b.release_date : b.first_air_date;
              if (!dateA || !dateB) return 0;
              return new Date(dateB).getTime() - new Date(dateA).getTime();
            }

            case "title": {
              const titleA = "title" in a ? a.title : a.name;
              const titleB = "title" in b ? b.title : b.name;
              return titleA.localeCompare(titleB);
            }

            default:
              return 0;
          }
        });
      }
    }

    return filtered;
  }, [data, searchQuery, filters]);

  return filteredAndSorted;
}

export function extractGenres<T extends MediaItem>(data: T[]): string[] {
  const genresSet = new Set<string>();
  data.forEach((item) => {
    if (item.genre_names) {
      item.genre_names.forEach((genre) => genresSet.add(genre));
    }
  });
  return Array.from(genresSet).sort();
}

export function extractYears<T extends MediaItem>(data: T[]): string[] {
  const yearsSet = new Set<string>();
  data.forEach((item) => {
    const releaseDate =
      "release_date" in item ? item.release_date : item.first_air_date;
    if (releaseDate) {
      const year = new Date(releaseDate).getFullYear().toString();
      yearsSet.add(year);
    }
  });
  return Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
}

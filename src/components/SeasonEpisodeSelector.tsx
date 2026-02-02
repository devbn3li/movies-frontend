"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// TMDB Episode type
interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number
  runtime: number | null;
}

// TMDB Season Details type
interface TMDBSeasonDetails {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episodes: TMDBEpisode[];
  poster_path: string | null;
  air_date: string;
}

// Season summary type (from TV show details)
interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

interface SeasonEpisodeSelectorProps {
  seriesId: number;
  seasons: SeasonSummary[];
  onEpisodeSelect?: (seasonNumber: number, episodeNumber: number, episode: TMDBEpisode) => void;
}

export default function SeasonEpisodeSelector({
  seriesId,
  seasons,
  onEpisodeSelect,
}: SeasonEpisodeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter out season 0 (specials) and sort by season number
  const regularSeasons = seasons
    .filter((s) => s.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  // Get initial values from URL or default to first season/episode
  const urlSeason = searchParams.get("season");
  const urlEpisode = searchParams.get("episode");

  const initialSeason = urlSeason ? parseInt(urlSeason, 10) : (regularSeasons.length > 0 ? regularSeasons[0].season_number : 1);
  const initialEpisode = urlEpisode ? parseInt(urlEpisode, 10) : 1;

  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(initialEpisode);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<TMDBEpisode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update URL when season/episode changes
  const updateURL = (season: number, episode: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", season.toString());
    params.set("episode", episode.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch episodes when season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      setIsLoading(true);
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        };

        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${seriesId}/season/${selectedSeason}`,
          options
        );

        if (response.ok) {
          const data: TMDBSeasonDetails = await response.json();
          setEpisodes(data.episodes || []);

          // On first load, use URL episode or first episode
          if (!isInitialized && data.episodes && data.episodes.length > 0) {
            const targetEpisode = data.episodes.find(ep => ep.episode_number === initialEpisode) || data.episodes[0];
            setSelectedEpisode(targetEpisode.episode_number);
            setCurrentEpisode(targetEpisode);
            onEpisodeSelect?.(selectedSeason, targetEpisode.episode_number, targetEpisode);

            // Update URL if not already set
            if (!urlSeason || !urlEpisode) {
              updateURL(selectedSeason, targetEpisode.episode_number);
            }
            setIsInitialized(true);
          } else if (data.episodes && data.episodes.length > 0) {
            // After initialization, auto-select first episode when season changes
            const firstEpisode = data.episodes[0];
            setSelectedEpisode(firstEpisode.episode_number);
            setCurrentEpisode(firstEpisode);
            onEpisodeSelect?.(selectedSeason, firstEpisode.episode_number, firstEpisode);
            updateURL(selectedSeason, firstEpisode.episode_number);
          }
        }
      } catch (error) {
        console.error("Error fetching season details:", error);
        setEpisodes([]);
      }
      setIsLoading(false);
    };

    if (seriesId && selectedSeason) {
      fetchSeasonDetails();
    }
  }, [seriesId, selectedSeason]);

  // Update current episode when selection changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const episode = episodes.find((ep) => ep.episode_number === selectedEpisode);
    if (episode) {
      setCurrentEpisode(episode);
      onEpisodeSelect?.(selectedSeason, selectedEpisode, episode);
    }
  }, [selectedEpisode, episodes, isInitialized]);

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    // Episode will be updated after fetch completes
  };

  const handleEpisodeChange = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    updateURL(selectedSeason, episodeNumber);
  };

  if (regularSeasons.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1080px] border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Seasons & Episodes</h2>

      {/* Season Selector */}
      <div className="mb-4">
        <label className="text-white/70 text-sm mb-2 block">Season</label>
        <div className="flex flex-wrap gap-2">
          {regularSeasons.map((season) => (
            <button
              key={season.id}
              onClick={() => handleSeasonChange(season.season_number)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSeason === season.season_number
                ? "bg-primary text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
            >
              Season {season.season_number}
            </button>
          ))}
        </div>
      </div>

      {/* Episode Selector */}
      <div className="mb-4">
        <label className="text-white/70 text-sm mb-2 block">Episode</label>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {episodes.map((episode) => (
              <button
                key={episode.id}
                onClick={() => handleEpisodeChange(episode.episode_number)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selectedEpisode === episode.episode_number
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                title={episode.name}
              >
                {episode.episode_number}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Episode Info */}
      {currentEpisode && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Episode Thumbnail */}
            {currentEpisode.still_path && (
              <div className="shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w300${currentEpisode.still_path}`}
                  alt={currentEpisode.name}
                  width={300}
                  height={169}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            {/* Episode Details */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-1">
                S{selectedSeason}E{selectedEpisode}: {currentEpisode.name}
              </h3>
              {currentEpisode.air_date && (
                <p className="text-white/60 text-sm mb-2">
                  Air Date: {new Date(currentEpisode.air_date).toLocaleDateString()}
                  {currentEpisode.runtime && ` • ${currentEpisode.runtime} min`}
                </p>
              )}
              {currentEpisode.vote_average > 0 && (
                <p className="text-yellow-400 text-sm mb-2">
                  ⭐ {currentEpisode.vote_average.toFixed(1)}
                </p>
              )}
              <p className="text-white/80 text-sm line-clamp-3">
                {currentEpisode.overview || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export types for use in other components
export type { TMDBEpisode, TMDBSeasonDetails, SeasonSummary };

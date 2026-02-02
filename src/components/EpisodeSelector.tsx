"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Season summary type (from TV show details)
export interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

interface EpisodeSelectorProps {
  seriesId: number;
  seasons: SeasonSummary[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

/**
 * Simple Season and Episode selector component with 2 dropdowns
 */
export default function EpisodeSelector({
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}: EpisodeSelectorProps) {
  const [episodeCount, setEpisodeCount] = useState<number>(1);

  // Filter out season 0 (specials) and sort by season number
  const regularSeasons = seasons
    .filter((s) => s.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  // Update episode count when season changes
  useEffect(() => {
    const currentSeason = regularSeasons.find(s => s.season_number === selectedSeason);
    if (currentSeason) {
      setEpisodeCount(currentSeason.episode_count);
      // Reset to episode 1 if current episode is greater than available episodes
      if (selectedEpisode > currentSeason.episode_count) {
        onEpisodeChange(1);
      }
    }
  }, [selectedSeason, regularSeasons]);

  if (regularSeasons.length === 0) {
    return null;
  }

  // Generate episode numbers array
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center gap-4 justify-center">
      {/* Season Selector */}
      <div className="flex items-center gap-2">
        <label className="text-white/70 text-sm font-medium">Season</label>
        <Select
          value={selectedSeason.toString()}
          onValueChange={(value) => onSeasonChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {regularSeasons.map((season) => (
              <SelectItem
                key={season.id}
                value={season.season_number.toString()}
              >
                Season {season.season_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Episode Selector */}
      <div className="flex items-center gap-2">
        <label className="text-white/70 text-sm font-medium">Episode</label>
        <Select
          value={selectedEpisode.toString()}
          onValueChange={(value) => onEpisodeChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Episode" />
          </SelectTrigger>
          <SelectContent>
            {episodes.map((ep) => (
              <SelectItem key={ep} value={ep.toString()}>
                Episode {ep}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

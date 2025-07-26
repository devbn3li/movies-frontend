"use client";

import { useState, useEffect } from "react";
import { getVideos, getMainTrailer } from "@/lib/api";
import { Video } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";

interface TrailerProps {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "card";
}

export default function Trailer({
  id,
  mediaType,
  title,
  size = "md",
  variant = "button"
}: TrailerProps) {
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!id) return;

      setIsLoading(true);
      setHasError(false);

      try {
        const videos = await getVideos(id, mediaType);
        const mainTrailer = getMainTrailer(videos);
        setTrailer(mainTrailer);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailer();
  }, [id, mediaType]);

  if (isLoading || hasError || !trailer) {
    return null;
  }

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-xs";
      case "lg":
        return "h-8 px-6 text-base";
      default:
        return "h-8 px-4 text-sm";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 14;
      case "lg":
        return 14;
      default:
        return 14;
    }
  };

  const renderTrigger = () => {
    if (variant === "card") {
      return (
        <div className="relative group cursor-pointer bg-black/80 hover:bg-black/90 rounded-lg p-4 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 rounded-full p-2 group-hover:bg-red-700 transition-colors">
              <Play size={getIconSize()} className="text-white fill-white ml-0.5" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Watch Trailer</h3>
              <p className="text-gray-300 text-xs">{trailer.name}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        className={`${getButtonSize()} bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-all duration-300`}
      >
        <Play size={getIconSize()} className="mr-2 fill-white" />
        Watch Trailer
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black border-gray-800">
        <DialogTitle className="sr-only">
          {title} - Trailer
        </DialogTitle>
        <div className="relative w-full h-full">
          {/* Video Player */}
          <div className="w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} - ${trailer.name}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <h3 className="text-white font-bold text-lg mb-1">{trailer.name}</h3>
            <p className="text-gray-300 text-sm">
              {title} • {trailer.type} • YouTube
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact version for grid cards
export function CompactTrailer({ id, mediaType, title }: Omit<TrailerProps, "size" | "variant">) {
  return (
    <Trailer
      id={id}
      mediaType={mediaType}
      title={title}
      size="sm"
      variant="button"
    />
  );
}

// Card version for featured sections
export function TrailerCard({ id, mediaType, title }: Omit<TrailerProps, "size" | "variant">) {
  return (
    <Trailer
      id={id}
      mediaType={mediaType}
      title={title}
      size="md"
      variant="card"
    />
  );
}

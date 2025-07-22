"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickShareButtonProps {
  id: number;
  title: string;
  type: "movie" | "tv";
  className?: string;
}

export default function QuickShareButton({ id, title, type, className }: QuickShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const itemUrl = `${baseUrl}/${type}/${id}`;

  const shareText = `Check out "${title}" on MoviesDB: ${itemUrl}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - MoviesDB`,
          text: shareText,
          url: itemUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copying
      try {
        await navigator.clipboard.writeText(itemUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={`bg-white/10 hover:bg-white/20 text-white border-none p-2 ${className}`}
      title="Share this content"
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuickSearchProps {
  className?: string;
}

export default function QuickSearch({ className }: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setQuery("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page or handle search
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const expandSearch = () => {
    setIsExpanded(true);
  };

  const closeSearch = () => {
    setIsExpanded(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isExpanded ? (
        <button
          onClick={expandSearch}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-white/80 hover:text-white" />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 py-2 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 rounded-full text-sm"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

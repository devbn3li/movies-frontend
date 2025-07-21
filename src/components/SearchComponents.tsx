"use client";

import { memo } from "react";

export const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="p-6 text-center text-white/60">
      <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-3"></div>
      <p className="text-sm">Searching movies, TV shows & people...</p>
    </div>
  );
});

export const LoadMoreButton = memo<{
  onClick: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
}>(function LoadMoreButton({ onClick, isLoading, currentPage, totalPages }) {
  return (
    <div className="p-4 border-t border-white/10">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white/60 rounded-full"></div>
            Loading...
          </>
        ) : (
          <>
            Load More Results
            <span className="text-white/60">({currentPage}/{totalPages})</span>
          </>
        )}
      </button>
    </div>
  );
});

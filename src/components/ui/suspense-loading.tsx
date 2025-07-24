"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface SuspenseLoadingProps {
  variant?: 'profile' | 'grid' | 'card' | 'search' | 'default';
  count?: number;
}

export const SuspenseLoading = ({ variant = 'default', count = 1 }: SuspenseLoadingProps) => {
  const renderProfileSkeleton = () => (
    <div className="relative min-h-[calc(100vh-5.07rem)] mb-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>

      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center">
            {/* Profile Image Skeleton */}
            <Skeleton className="w-48 h-48 rounded-full" />

            {/* Name Skeleton */}
            <Skeleton className="h-10 w-64 mt-6" />

            {/* Email Skeleton */}
            <Skeleton className="h-6 w-48 mt-2" />

            {/* Country Skeleton */}
            <Skeleton className="h-5 w-32 mt-1" />

            {/* Stats Skeleton */}
            <div className="flex items-center gap-8 mt-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section Skeleton */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-lg">
          <Skeleton className="w-20 h-28 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSearchSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg animate-pulse">
          <Skeleton className="w-12 h-16 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  switch (variant) {
    case 'profile':
      return renderProfileSkeleton();
    case 'grid':
      return renderGridSkeleton();
    case 'card':
      return renderCardSkeleton();
    case 'search':
      return renderSearchSkeleton();
    default:
      return <Skeleton className="h-32 w-full" />;
  }
};

export default SuspenseLoading;

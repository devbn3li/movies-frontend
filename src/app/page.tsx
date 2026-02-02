"use client";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import Image from "next/image";
import TrendingNow from "@/components/TrendingNow";
import FeaturedContent from "@/components/FeaturedContent";
import GlobalSearch from "@/components/GlobalSearch";

export default function HomePage() {
  // Scroll tracking
  useScrollTracking({
    pageName: 'Home Page',
    enabled: true
  });

  return (
    <main className="flex flex-col">
      {/* Fixed Background Layer */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <Image
          src="/larg_bg_en.jpg"
          alt="Movie Zone - Stream unlimited movies and TV shows"
          fill
          className="object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center text-center px-4">
        <header className="z-10">
          <h1 className="text-[4rem] font-bold text-white drop-shadow-md max-w-3xl">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-lg text-white/80 mt-4 max-w-2xl">
            Discover thousands of movies and TV shows. Stream the latest releases, classic films, and popular series - all free, no ads, no interruptions.
          </p>

          <div className="mt-8">
            <div className="text-center w-full max-w-[800px] mx-auto relative px-4 z-50">
              <GlobalSearch className="w-full relative" />
            </div>
          </div>
        </header>
      </section>

      {/* Content Section with Background */}
      <section className="p-5 sm:px-20 pb-20 flex flex-col bg-white dark:bg-black relative z-0">
        <div className="mb-8">
          <FeaturedContent type="movie" title="Popular Movies" isLarge={true} showViewAllLink={true} />
        </div>

        <div className="mb-8">
          <FeaturedContent type="tv" title="Popular TV Shows" isLarge={true} showViewAllLink={true} />
        </div>

        <div className="mb-8">
          <TrendingNow type="movie" title="Trending Movies" isLarge={true} />
        </div>

        <div>
          <TrendingNow type="tv" title="Trending TV Shows" isLarge={true} />
        </div>
      </section>
    </main>
  );
}

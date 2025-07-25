"use client";
import { useAuth } from "@/hooks/useAuth";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import poster from "@/assets/larg_bg_en.jpg";
import Image from "next/image";
import TrendingNow from "@/components/TrendingNow";
import AuthModal from "@/components/AuthModal";
import GlobalSearch from "@/components/GlobalSearch";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  // Scroll tracking
  useScrollTracking({
    pageName: 'Home Page',
    enabled: true
  });

  return (
    <main className="flex flex-col">
      <section className="relative h-[calc(100vh-4rem)] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={poster}
            alt="Movie Zone - Stream unlimited movies and TV shows"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/60 z-10" />

        <header className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-[4rem] font-bold text-white drop-shadow-md max-w-3xl">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-lg text-white/80 mt-4 max-w-2xl">
            Discover thousands of movies and TV shows. Stream the latest releases, classic films, and popular series - all free, no ads, no interruptions.
          </p>

          <div className="mt-8">
            {!loading && !isAuthenticated && (
              <AuthModal>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 shimmer-effect">
                  Start Watching
                </button>
              </AuthModal>
            )}
            {!loading && isAuthenticated && (
              <div
                className="text-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-[600px] lg:max-w-[800px] mx-auto relative px-4"
                style={{ zIndex: 1000 }}
              >
                <GlobalSearch className="w-full relative" />
              </div>
            )}
          </div>
        </header>
      </section>

      <section className="p-5 sm:px-20 pb-20 flex flex-col">
        <div>
          <TrendingNow type="movie" title="Movies" isLarge={true} />
        </div>

        <div>
          <TrendingNow type="tv" title="TV Shows" isLarge={true} />
        </div>
      </section>
    </main>
  );
}

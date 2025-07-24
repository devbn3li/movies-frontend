"use client";

import { useMemo, useEffect, useState, Suspense } from "react";
import Image from "next/image";
import mediaData from "@/assets/moviesdb.json";
import { notFound } from "next/navigation";
import { Movie, TVShow } from "@/types/index";
import WatchlistButton from "@/components/WatchlistButton";
import Head from "next/head";
import Loading from "@/components/Loading";
import ShareDownloadButtons from "@/components/ShareDownloadButtons";
import { trackMoviePageView } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { lazyComponents } from "@/hooks/useLazyComponent";
import { SuspenseLoading } from "@/components/ui/suspense-loading";
import LazyLoadErrorBoundary from "@/components/ui/lazy-load-error-boundary";

// Lazy load heavy components
const MayLike = lazyComponents.MayLike;
const TrendingNow = lazyComponents.TrendingNow;
const Cast = lazyComponents.Cast;
const WatchProviders = lazyComponents.WatchProviders;
const Recommendations = lazyComponents.Recommendations;

type Media = Movie | TVShow;

// TMDB Movie type
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  adult: boolean;
  video: boolean;
}

// Convert TMDB data to local format
const convertTMDBToLocal = (tmdbMovie: TMDBMovie): Movie => ({
  id: tmdbMovie.id,
  title: tmdbMovie.title,
  original_title: tmdbMovie.original_title,
  overview: tmdbMovie.overview,
  release_date: tmdbMovie.release_date,
  genre_names: tmdbMovie.genres.map(g => g.name),
  poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
  backdrop_url: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}` : null,
  popularity: tmdbMovie.popularity,
  vote_average: tmdbMovie.vote_average,
  vote_count: tmdbMovie.vote_count,
  original_language: tmdbMovie.original_language,
  adult: tmdbMovie.adult,
  video: tmdbMovie.video,
});

export default function MoviePage({ movieId }: { movieId: string }) {
  const id = useMemo(() => Number(movieId), [movieId]);
  const [item, setItem] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll tracking
  useScrollTracking({
    pageName: `Movie Page - ${movieId}`,
    enabled: !isLoading && !!item
  });

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      setIsLoading(true);

      // First, try to find in local data
      const { movies, tv_shows } = mediaData as {
        movies: Movie[];
        tv_shows: TVShow[];
      };
      const all: Media[] = [...movies, ...tv_shows];
      const localItem = all.find((m) => m.id === id);

      if (localItem) {
        console.log(`✅ Found movie ${id} locally:`, "title" in localItem ? localItem.title : localItem.name);
        setItem(localItem);
        setIsLoading(false);

        // Track Analytics page view
        const title = "title" in localItem ? localItem.title : localItem.name;
        trackMoviePageView(title || 'Unknown', localItem.id);
        return;
      }

      // If not found locally, fetch from TMDB (try movie first)
      console.log(`🌐 Movie ${id} not found locally, fetching from TMDB...`);
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          }
        };

        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options);

        if (response.ok) {
          const tmdbData: TMDBMovie = await response.json();
          console.log(`✅ Successfully fetched movie ${id} from TMDB:`, tmdbData.title);
          const convertedItem = convertTMDBToLocal(tmdbData);
          setItem(convertedItem);

          // Track Analytics page view
          trackMoviePageView(tmdbData.title || 'Unknown', tmdbData.id);
        } else {
          console.log(`❌ Movie ${id} not found on TMDB (Status: ${response.status})`);
          setItem(null);
        }
      } catch (error) {
        console.error('Error fetching from TMDB:', error);
        setItem(null);
      }

      setIsLoading(false);
    };

    fetchMovieData();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!item) {
    return notFound();
  }

  const title = "title" in item ? item.title : item.name;
  const rDate = "release_date" in item ? item.release_date : item.first_air_date;
  const original_title = "original_title" in item ? item.original_title : item.original_name;
  const poster = item.poster_url || "/placeholder.jpg";
  const backdrop = item.backdrop_url || item.poster_url || "/placeholder.jpg";
  const mediaType = "title" in item ? "movie" : "tv";

  // Check if we're using poster as backdrop (no backdrop available)
  const isUsingPosterAsBackdrop = !item.backdrop_url && item.poster_url;

  return (
    <div className="relative min-h-[calc(100vh-5.07rem)] mb-20">
      <Head>
        <title>{title} ({rDate?.slice(0, 4)}) - Watch Online | MoviesDB</title>
        <meta name="description" content={`Watch ${title} (${rDate?.slice(0, 4)}) online. ${item.overview ? item.overview.slice(0, 160) : `Discover ${title} and more movies on MoviesDB.`}`} />
        <meta name="keywords" content={`${title}, movie, ${item.genre_names?.join(", ")}, ${rDate?.slice(0, 4)}, watch online, stream`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${title} (${rDate?.slice(0, 4)}) - MoviesDB`} />
        <meta property="og:description" content={item.overview || `Watch ${title} on MoviesDB`} />
        <meta property="og:image" content={poster} />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="MoviesDB" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} (${rDate?.slice(0, 4)})`} />
        <meta name="twitter:description" content={item.overview || `Watch ${title} on MoviesDB`} />
        <meta name="twitter:image" content={poster} />

        {/* Additional Meta Tags */}
        <meta name="author" content="MoviesDB" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.href : ''}`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Movie",
              name: title,
              description: item.overview,
              image: poster,
              datePublished: rDate,
              genre: item.genre_names,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: item.vote_average || 0,
                reviewCount: item.vote_count || 0,
                bestRating: 10,
                worstRating: 0,
              },
              url: `${typeof window !== 'undefined' ? window.location.href : ''}`,
              potentialAction: {
                "@type": "WatchAction",
                target: `${typeof window !== 'undefined' ? window.location.href : ''}`,
              },
            }),
          }}
        />
      </Head>

      {/* 💠 Dynamic Background Blur */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed blur-2xl opacity-30"
        style={{ backgroundImage: `url(${backdrop})` }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="background-image"] {
              background-image: url(${poster}) !important;
            }
          }
        `}</style>
      </div>

      {/* 💠 Page Content */}
      <div className="flex flex-col items-center p-6 mt-5">
        <div className="mb-4">
          <div className="block md:hidden">
            <Image
              src={poster}
              alt={title}
              className="object-cover mb-4 aspect-[2/3] rounded-2xl h-auto"
              width={400}
              height={600}
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={backdrop}
              alt={title}
              className={`object-cover mb-4 rounded-2xl shadow-xl ${isUsingPosterAsBackdrop
                ? "aspect-[2/3] max-w-md mx-auto"
                : "aspect-video"
                }`}
              width={isUsingPosterAsBackdrop ? 400 : 1080}
              height={isUsingPosterAsBackdrop ? 600 : 480}
            />
          </div>
        </div>

        <div className="max-w-[1080px] w-full border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl mb-10">
          <div className="flex max-sm:flex-col items-center justify-between gap-5 mb-4 w-full">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-xl text-yellow-400">
                ⭐{" "}
                {typeof item.vote_average === "number"
                  ? item.vote_average.toFixed(1)
                  : "0.0"}
              </span>
              <WatchlistButton item={item} type={mediaType as 'movie' | 'tv'} showText />
            </div>
          </div>
          <p className="text-[#FFFFFF] mb-2 text-lg font-medium">
            {rDate?.slice(0, 4)} | {item.adult ? "18+" : "+16"} |{" "}
            {item.genre_names[0] || "Unknown Genre"}
          </p>
          <p className="mb-4 text-white text-lg font-medium">
            {item.overview || "No description available."}
          </p>

          {/* أزرار المشاركة والتحميل */}
          <div className="flex justify-center">
            <ShareDownloadButtons
              id={id}
              title={title}
              type={mediaType as 'movie' | 'tv'}
              overview={item.overview}
              releaseDate={rDate}
              rating={item.vote_average}
              posterUrl={poster}
            />
          </div>
        </div>

        <div className="max-w-[1080px] w-full flex flex-col gap-6">
          <h2 className="text-[32px] font-bold text-white">More Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-2">
              <div>
                <p className="text-white text-lg font-medium">Original Name</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">
                  {original_title || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-white text-lg font-medium">Release Date</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">
                  {rDate || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-white text-lg font-medium">Genre</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">
                  {item.genre_names?.join(", ") || "Unknown"}
                </p>
              </div>
            </div>

            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-1">
              <div>
                <p className="text-white text-lg font-medium">Original Language</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">
                  {item.original_language || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-white text-lg font-medium">Subtitles</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">English</p>
              </div>
            </div>

            <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl space-y-1">
              <div>
                <p className="text-white text-lg font-medium">Popularity</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.popularity}</p>
              </div>
              <div>
                <p className="text-white text-lg font-medium">Rating</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.vote_average}</p>
              </div>
              <div>
                <p className="text-white text-lg font-medium">Vote Count</p>
                <p className="text-[#FFFFFFB3] text-lg font-medium">{item.vote_count}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Providers Section */}
        <div className="max-w-[1080px] w-full mt-6">
          <LazyLoadErrorBoundary>
            <Suspense fallback={<SuspenseLoading variant="card" count={1} />}>
              <WatchProviders id={id} mediaType={mediaType as 'movie' | 'tv'} />
            </Suspense>
          </LazyLoadErrorBoundary>
        </div>

        <div className="mt-10 max-w-[1080px] w-full">
          <LazyLoadErrorBoundary>
            <Suspense fallback={<SuspenseLoading variant="grid" count={6} />}>
              {movieId && <Cast movieId={id} mediaType={mediaType as 'movie' | 'tv'} movieTitle={title} />}
            </Suspense>
          </LazyLoadErrorBoundary>
        </div>

        <LazyLoadErrorBoundary>
          <Suspense fallback={<SuspenseLoading variant="grid" count={8} />}>
            {movieId && <Recommendations movieId={movieId} type={mediaType as 'movie' | 'tv'} originalTitle={title} />}
          </Suspense>
        </LazyLoadErrorBoundary>

        <LazyLoadErrorBoundary>
          <Suspense fallback={<SuspenseLoading variant="grid" count={6} />}>
            {movieId && <MayLike movieId={movieId} type={mediaType} />}
          </Suspense>
        </LazyLoadErrorBoundary>

        <LazyLoadErrorBoundary>
          <Suspense fallback={<SuspenseLoading variant="grid" count={8} />}>
            {movieId && <TrendingNow title={"Now"} type={mediaType} isLarge={false} />}
          </Suspense>
        </LazyLoadErrorBoundary>
      </div>
    </div>
  );
}

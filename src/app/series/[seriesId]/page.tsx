import type { Metadata } from "next";
import SeriesPage from "./SeriesPage";
import { getTVSeriesDetails } from "@/lib/api";
import { TVShow } from "@/types/index";

type Props = {
  params: Promise<{ seriesId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesId } = await params;
  const id = parseInt(seriesId);

  let series: TVShow | null = null;

  // استخدام TMDB مباشرة لتجنب 403 errors
  try {
    const tmdbSeries = await getTVSeriesDetails(id);
    if (tmdbSeries) {
      series = {
        id: tmdbSeries.id,
        name: tmdbSeries.name,
        original_name: tmdbSeries.original_name,
        overview: tmdbSeries.overview,
        first_air_date: tmdbSeries.first_air_date,
        genre_names: tmdbSeries.genres?.map((g: { id: number; name: string }) => g.name) || [],
        poster_url: tmdbSeries.poster_path ? `https://image.tmdb.org/t/p/w300${tmdbSeries.poster_path}` : null,
        backdrop_url: tmdbSeries.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbSeries.backdrop_path}` : null,
        popularity: tmdbSeries.popularity,
        vote_average: tmdbSeries.vote_average,
        vote_count: tmdbSeries.vote_count,
        original_language: tmdbSeries.original_language,
        origin_country: tmdbSeries.origin_country,
        adult: tmdbSeries.adult,
      };
    }
  } catch (error) {
    console.error('Error fetching series from TMDB:', error);
    // Fallback metadata if series fetch fails
    return {
      title: `TV Series - Movie Zone`,
      description: `Watch this amazing TV series and discover more entertainment on Movie Zone.`,
      keywords: ["TV series", "watch online", "streaming", "entertainment"],
      alternates: {
        canonical: `https://moviezone.me/series/${seriesId}`,
      },
      openGraph: {
        title: `TV Series - Movie Zone`,
        description: `Watch this amazing TV series and discover more entertainment on Movie Zone.`,
        url: `https://moviezone.me/series/${seriesId}`,
        type: "video.tv_show",
      },
    };
  }

  if (!series) {
    return {
      title: `TV Series - Movie Zone`,
      description: `Watch this amazing TV series and discover more entertainment on Movie Zone.`,
    };
  }

  const title = series.name;
  const year = series.first_air_date ? series.first_air_date.slice(0, 4) : "";
  const description = series.overview || `Watch ${title} ${year ? `(${year})` : ""} TV series online. Discover episodes, cast, and more on Movie Zone.`;
  const poster = series.poster_url || "/placeholder.jpg";
  const genres = series.genre_names?.join(", ") || "";

  return {
    title: `${title}${year ? ` (${year})` : ""} - Watch TV Series Online | Movie Zone`,
    description,
    keywords: [
      title,
      "TV series",
      "watch online",
      "streaming",
      "episodes",
      genres,
      year,
      "Movie Zone"
    ].filter(Boolean),
    alternates: {
      canonical: `https://moviezone.me/series/${seriesId}`,
    },
    openGraph: {
      title: `${title}${year ? ` (${year})` : ""} - Movie Zone`,
      description,
      images: [
        {
          url: poster,
          width: 500,
          height: 750,
          alt: `${title} poster`,
        },
      ],
      url: `https://moviezone.me/series/${seriesId}`,
      type: "video.tv_show",
      siteName: "Movie Zone",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${year ? ` (${year})` : ""}`,
      description,
      images: [poster],
      site: "@MovieZone",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:section": "Entertainment",
      "article:tag": genres,
    },
  };
}

export default async function Page({ params }: Props) {
  const { seriesId } = await params;
  return <SeriesPage seriesId={parseInt(seriesId)} />;
}

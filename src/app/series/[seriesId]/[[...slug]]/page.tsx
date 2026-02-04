import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SeriesPage from "../SeriesPage";
import { TVShow } from "@/types/index";
import {
  generateSeriesKeywords,
  generateSeriesDescription,
} from "@/lib/seo-utils";
import { generateSlug, generateFullSeriesUrl } from "@/lib/slug-utils";

// Types for TMDB responses
interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

// Get TV series details from TMDB
async function getTVSeriesDetails(seriesId: number) {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}`,
      options
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching TV series from TMDB:", error);
    return null;
  }
}

// Get TV series credits (cast and crew)
async function getTVSeriesCredits(seriesId: number): Promise<TMDBCredits | null> {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: 3600 },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}/credits`,
      options
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ seriesId: string; slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesId, slug } = await params;
  const id = parseInt(seriesId);

  let series: TVShow | null = null;
  let credits: TMDBCredits | null = null;

  // Fetch series and credits in parallel
  try {
    const [tmdbSeries, tmdbCredits] = await Promise.all([
      getTVSeriesDetails(id),
      getTVSeriesCredits(id),
    ]);

    credits = tmdbCredits;

    if (tmdbSeries) {
      series = {
        id: tmdbSeries.id,
        name: tmdbSeries.name,
        original_name: tmdbSeries.original_name,
        overview: tmdbSeries.overview,
        first_air_date: tmdbSeries.first_air_date,
        genre_names:
          tmdbSeries.genres?.map((g: { id: number; name: string }) => g.name) ||
          [],
        poster_url: tmdbSeries.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbSeries.poster_path}`
          : null,
        backdrop_url: tmdbSeries.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${tmdbSeries.backdrop_path}`
          : null,
        popularity: tmdbSeries.popularity,
        vote_average: tmdbSeries.vote_average,
        vote_count: tmdbSeries.vote_count,
        original_language: tmdbSeries.original_language,
        origin_country: tmdbSeries.origin_country,
        number_of_seasons: tmdbSeries.number_of_seasons,
        number_of_episodes: tmdbSeries.number_of_episodes,
      };
    }
  } catch (error) {
    console.error("Error fetching series from TMDB:", error);
    // Fallback metadata if series fetch fails
    return {
      title: `TV Series - Movie Zone`,
      description: `Watch this amazing TV series and discover more entertainment on Movie Zone. مشاهدة المسلسل اون لاين مترجم على موفي زون.`,
      keywords: [
        "TV series",
        "watch online",
        "streaming",
        "entertainment",
        "مشاهدة",
        "مسلسل",
        "مترجم",
        "اون لاين",
      ],
      alternates: {
        canonical: `https://moviezone-inky.vercel.app/series/${seriesId}`,
      },
      openGraph: {
        title: `TV Series - Movie Zone`,
        description: `Watch this amazing TV series and discover more entertainment on Movie Zone.`,
        url: `https://moviezone-inky.vercel.app/series/${seriesId}`,
        type: "video.tv_show",
      },
    };
  }

  if (!series) {
    return {
      title: `TV Series - Movie Zone`,
      description: `Watch this amazing TV series and discover more entertainment on Movie Zone. مشاهدة المسلسل اون لاين مترجم.`,
    };
  }

  const name = series.name;
  const year = series.first_air_date ? series.first_air_date.slice(0, 4) : "";
  const genres = series.genre_names || [];
  const poster = series.poster_url || "/og-image.png";

  // Generate canonical URL with slug
  const canonicalUrl = generateFullSeriesUrl(series.id, name);

  // Extract cast and creator from credits
  const castNames = credits?.cast?.slice(0, 10).map((c) => c.name) || [];
  const creator = credits?.crew?.find(
    (c) => c.job === "Creator" || c.job === "Executive Producer"
  )?.name;

  // Generate dynamic keywords with Arabic support
  const keywords = generateSeriesKeywords(
    name,
    series.original_name,
    year,
    genres,
    castNames,
    creator
  );

  // Generate enhanced description
  const description = generateSeriesDescription(
    name,
    series.overview,
    year,
    genres,
    series.vote_average,
    series.number_of_seasons
  );

  // Generate breadcrumbs for structured data (with slug)
  const breadcrumbs = [
    { name: "Home", url: "https://moviezone-inky.vercel.app" },
    { name: "TV Series", url: "https://moviezone-inky.vercel.app/main-series" },
    { name: name, url: canonicalUrl },
  ];

  // Create JSON-LD structured data
  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "@id": canonicalUrl,
    name: name,
    alternateName: series.original_name !== name ? series.original_name : undefined,
    description: series.overview,
    image: [poster, series.backdrop_url].filter(Boolean),
    url: canonicalUrl,
    datePublished: series.first_air_date,
    inLanguage: series.original_language,
    genre: genres,
    numberOfSeasons: series.number_of_seasons,
    numberOfEpisodes: series.number_of_episodes,
    countryOfOrigin: series.origin_country?.[0]
      ? { "@type": "Country", name: series.origin_country[0] }
      : undefined,
    creator: creator
      ? {
        "@type": "Person",
        name: creator,
      }
      : undefined,
    actor: credits?.cast?.slice(0, 10).map((actor) => ({
      "@type": "Person",
      name: actor.name,
    })),
    aggregateRating:
      series.vote_average && series.vote_count
        ? {
          "@type": "AggregateRating",
          ratingValue: series.vote_average.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: series.vote_count,
        }
        : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  // Clean undefined values from schema
  const cleanSeriesSchema = JSON.parse(JSON.stringify(seriesSchema));

  return {
    title: `${name}${year ? ` (${year})` : ""} - Watch TV Series Online | Movie Zone`,
    description,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${name}${year ? ` (${year})` : ""} - Watch Free on Movie Zone`,
      description,
      images: [
        {
          url: poster,
          width: 500,
          height: 750,
          alt: `${name} TV series poster - مشاهدة مسلسل ${name}`,
        },
      ],
      url: canonicalUrl,
      type: "video.tv_show",
      siteName: "Movie Zone",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}${year ? ` (${year})` : ""} - Watch Free`,
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
      "article:tag": genres.join(", "),
      "application/ld+json": JSON.stringify([cleanSeriesSchema, breadcrumbSchema]),
    },
  };
}

export default async function Page({ params }: Props) {
  const { seriesId, slug } = await params;
  const id = parseInt(seriesId);

  // Fetch series to get the correct slug for redirect
  const tmdbSeries = await getTVSeriesDetails(id);

  if (tmdbSeries) {
    const correctSlug = generateSlug(tmdbSeries.name);
    const currentSlug = slug?.[0] || "";

    // Redirect to correct slug URL if slug is missing or incorrect
    if (correctSlug && correctSlug !== currentSlug) {
      redirect(`/series/${id}/${correctSlug}`);
    }
  }

  return <SeriesPage seriesId={id} />;
}

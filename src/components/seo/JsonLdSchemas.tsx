/**
 * JSON-LD Schema Components for SEO
 * These components generate structured data for Google rich results
 */

import Script from "next/script";

// Types for schema data
interface MovieSchemaProps {
  id: number;
  title: string;
  originalTitle?: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate?: string;
  rating?: number;
  ratingCount?: number;
  genres?: string[];
  cast?: Array<{ name: string; character?: string }>;
  director?: string;
  runtime?: number;
  language?: string;
}

interface TVSeriesSchemaProps {
  id: number;
  name: string;
  originalName?: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  firstAirDate?: string;
  rating?: number;
  ratingCount?: number;
  genres?: string[];
  cast?: Array<{ name: string; character?: string }>;
  creator?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  language?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}

// Base URL for the site
const BASE_URL = "https://moviezone-inky.vercel.app";

/**
 * Movie Schema Component
 * Generates JSON-LD structured data for movie pages
 */
export function MovieSchema({
  id,
  title,
  originalTitle,
  description,
  posterUrl,
  backdropUrl,
  releaseDate,
  rating,
  ratingCount,
  genres,
  cast,
  director,
  runtime,
  language,
}: MovieSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": `${BASE_URL}/movie/${id}`,
    name: title,
    alternateName: originalTitle !== title ? originalTitle : undefined,
    description: description,
    image: [posterUrl, backdropUrl].filter(Boolean),
    url: `${BASE_URL}/movie/${id}`,
    datePublished: releaseDate,
    inLanguage: language,
    duration: runtime ? `PT${runtime}M` : undefined,
    genre: genres,
    director: director
      ? {
        "@type": "Person",
        name: director,
      }
      : undefined,
    actor: cast?.slice(0, 10).map((actor) => ({
      "@type": "Person",
      name: actor.name,
    })),
    aggregateRating:
      rating && ratingCount
        ? {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: ratingCount,
        }
        : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: `${BASE_URL}/movie/${id}`,
    },
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      id={`movie-schema-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

/**
 * TV Series Schema Component
 * Generates JSON-LD structured data for TV series pages
 */
export function TVSeriesSchema({
  id,
  name,
  originalName,
  description,
  posterUrl,
  backdropUrl,
  firstAirDate,
  rating,
  ratingCount,
  genres,
  cast,
  creator,
  numberOfSeasons,
  numberOfEpisodes,
  language,
}: TVSeriesSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "@id": `${BASE_URL}/series/${id}`,
    name: name,
    alternateName: originalName !== name ? originalName : undefined,
    description: description,
    image: [posterUrl, backdropUrl].filter(Boolean),
    url: `${BASE_URL}/series/${id}`,
    datePublished: firstAirDate,
    inLanguage: language,
    genre: genres,
    numberOfSeasons: numberOfSeasons,
    numberOfEpisodes: numberOfEpisodes,
    creator: creator
      ? {
        "@type": "Person",
        name: creator,
      }
      : undefined,
    actor: cast?.slice(0, 10).map((actor) => ({
      "@type": "Person",
      name: actor.name,
    })),
    aggregateRating:
      rating && ratingCount
        ? {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: ratingCount,
        }
        : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: `${BASE_URL}/series/${id}`,
    },
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      id={`tvseries-schema-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

/**
 * Breadcrumb Schema Component
 * Generates JSON-LD structured data for breadcrumb navigation
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Video Schema Component
 * Generates JSON-LD structured data for video/trailer content
 */
export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: name,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    contentUrl: contentUrl,
    embedUrl: embedUrl,
    duration: duration,
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      id="video-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

/**
 * Organization Schema Component
 * Generates JSON-LD structured data for the website organization
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Movie Zone",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Watch free movies and TV shows online. Stream the latest releases, classic films, and popular series.",
    sameAs: ["https://github.com/devbn3li/"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${BASE_URL}/contact`,
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Website Search Schema Component
 * Enables sitelinks searchbox in Google
 */
export function WebsiteSearchSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Movie Zone",
    url: BASE_URL,
    description:
      "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Movie Zone",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };

  return (
    <Script
      id="website-search-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Export types for use in other components
export type {
  MovieSchemaProps,
  TVSeriesSchemaProps,
  BreadcrumbSchemaProps,
  BreadcrumbItem,
  VideoSchemaProps,
};

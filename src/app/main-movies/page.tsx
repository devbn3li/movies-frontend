import type { Metadata } from "next";
import MoviesPage from "./MoviesPage";

export const metadata: Metadata = {
  title: "Free Movies - Stream Latest Movies Online | Movie Zone",
  description:
    "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more. Stream HD movies without ads or sign-up. مشاهدة افلام اون لاين مترجمة بجودة عالية - موفي زون",
  keywords: [
    // English keywords
    "free movies",
    "watch movies online",
    "stream movies",
    "latest movies",
    "HD movies",
    "action movies",
    "comedy movies",
    "drama movies",
    "horror movies",
    "thriller movies",
    "sci-fi movies",
    "new movies 2024",
    "new movies 2025",
    "full movies",
    "watch free",
    // Arabic keywords
    "مشاهدة افلام",
    "افلام اون لاين",
    "افلام مترجمة",
    "افلام جديدة",
    "افلام اجنبية",
    "افلام عربية",
    "افلام هندية",
    "افلام تركية",
    "افلام اكشن",
    "افلام كوميدي",
    "افلام رعب",
    "افلام رومانسية",
    "تحميل افلام",
    "موفي زون",
    "افلام 2024",
    "افلام 2025",
  ],
  alternates: {
    canonical: "https://moviezone-inky.vercel.app/main-movies",
    languages: {
      "en": "https://moviezone-inky.vercel.app/main-movies",
      "ar": "https://moviezone-inky.vercel.app/main-movies",
      "x-default": "https://moviezone-inky.vercel.app/main-movies",
    },
  },
  openGraph: {
    title: "Free Movies - Stream Latest Movies Online | Movie Zone",
    description:
      "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more. Stream HD movies without ads or sign-up.",
    url: "https://moviezone-inky.vercel.app/main-movies",
    type: "website",
    siteName: "Movie Zone",
    images: [
      {
        url: "https://moviezone-inky.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Movies - Movie Zone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Movies - Stream Latest Movies Online | Movie Zone",
    description:
      "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more.",
    images: ["https://moviezone-inky.vercel.app/og-image.png"],
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
};

export default function Page() {
  return <MoviesPage />;
}
import type { Metadata } from "next";
import MoviesPage from "./MoviesPage";

export const metadata: Metadata = {
  title: "Free Movies - Stream Latest Movies Online | Movie Zone",
  description: "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more. Stream HD movies without ads or sign-up.",
  keywords: ["free movies", "watch movies online", "stream movies", "latest movies", "HD movies", "action movies", "comedy movies", "drama movies"],
  alternates: {
    canonical: "https://moviezone-inky.vercel.app/main-movies",
  },
  openGraph: {
    title: "Free Movies - Stream Latest Movies Online | Movie Zone",
    description: "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more. Stream HD movies without ads or sign-up.",
    url: "https://moviezone-inky.vercel.app/main-movies",
    type: "website",
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
    description: "Discover thousands of free movies online. Watch the latest releases, classic films, action, comedy, drama, horror, and more.",
    images: ["https://moviezone-inky.vercel.app/og-image.png"],
  },
};

export default function Page() {
  return <MoviesPage />;
}
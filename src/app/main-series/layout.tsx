import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free TV Shows & Series - Stream Online | Movie Zone",
  description: "Watch thousands of free TV shows and series online. Stream the latest episodes, classic series, drama, comedy, action, sci-fi and more. HD streaming without ads or registration.",
  keywords: ["free tv shows", "watch series online", "stream tv shows", "latest episodes", "HD series", "drama series", "comedy shows", "action series"],
  alternates: {
    canonical: "https://moviezone-inky.vercel.app/main-series",
  },
  openGraph: {
    title: "Free TV Shows & Series - Stream Online | Movie Zone",
    description: "Watch thousands of free TV shows and series online. Stream the latest episodes, classic series, drama, comedy, action, sci-fi and more.",
    url: "https://moviezone-inky.vercel.app/main-series",
    type: "website",
    images: [
      {
        url: "https://moviezone-inky.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free TV Shows & Series - Movie Zone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free TV Shows & Series - Stream Online | Movie Zone",
    description: "Watch thousands of free TV shows and series online. Stream the latest episodes, classic series, drama, comedy, action, sci-fi and more.",
    images: ["https://moviezone-inky.vercel.app/og-image.png"],
  },
};

export default function MainSeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

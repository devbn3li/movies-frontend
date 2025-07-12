import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Movie Zone - Watch Free Movies & TV Shows Online",
  description: "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
  keywords: ["movies", "TV shows", "streaming", "entertainment", "free movies", "watch online", "cinema", "films", "series"],
  authors: [{ name: "Mohamed Ali", url: "https://github.com/devbn3li/" }],
  alternates: {
    canonical: "https://moviezonee.mooo.com/",
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
  openGraph: {
    title: "Movie Zone - Watch Free Movies & TV Shows Online",
    description: "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
    url: "https://moviezonee.mooo.com/",
    type: "website",
    siteName: "Movie Zone",
    images: [
      {
        url: "https://moviezonee.mooo.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Movie Zone - Free Movies and TV Shows Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Zone - Watch Free Movies & TV Shows Online",
    description: "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
    images: ["https://moviezonee.mooo.com/og-image.png"],
    creator: "@devbn3li",
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Movie Zone",
      description: "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
      url: "https://moviezonee.mooo.com/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://moviezonee.mooo.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      publisher: {
        "@type": "Organization",
        name: "Movie Zone",
        url: "https://moviezonee.mooo.com/",
        logo: "https://moviezonee.mooo.com/logo.png"
      }
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="theme"
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="min-h-screen w-full">
              <div className="relative">
                <div className="fixed top-0 left-0 w-full z-50">
                  <SidebarTrigger className="sidebar-trigger" />
                  <Navbar />
                </div>
              </div>
              <AppSidebar />
              <div className="pt-16 min-h-[calc(100vh-5.07rem)]">{children}</div>
              <div className="relative bottom-0 w-full">
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

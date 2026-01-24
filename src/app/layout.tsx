import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import { Toaster } from 'react-hot-toast';
import QueryProvider from "@/components/providers/QueryProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Movie Zone - Watch Free Movies & TV Shows Online",
  description:
    "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
  keywords: [
    // English keywords
    "movies",
    "TV shows",
    "streaming",
    "entertainment",
    "free movies",
    "watch online",
    "cinema",
    "films",
    "series",
    "moviezone tv",
    "movie zone tv shows",
    "free tv streaming",
    "watch tv series online",
    "tv episodes online",
    "latest tv shows",
    "popular series",
    "binge watch",
    "HD movies",
    "full movies",
    "watch free",
    // Arabic keywords - مهمة للبحث العربي
    "موفي زون",
    "مشاهدة افلام",
    "مشاهدة مسلسلات",
    "افلام اون لاين",
    "مسلسلات اون لاين",
    "افلام مترجمة",
    "مسلسلات مترجمة",
    "افلام جديدة",
    "مسلسلات جديدة",
    "تحميل افلام",
    "افلام اجنبية",
    "مسلسلات اجنبية",
    "افلام عربية",
    "مسلسلات عربية",
    "افلام هندية",
    "افلام تركية",
    "مسلسلات تركية",
  ],
  authors: [{ name: "Mohamed Ali", url: "https://github.com/devbn3li/" }],
  alternates: {
    canonical: "https://moviezone-inky.vercel.app/",
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
    description:
      "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
    url: "https://moviezone-inky.vercel.app/",
    type: "website",
    siteName: "Movie Zone",
    images: [
      {
        url: "https://moviezone-inky.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Movie Zone - Free Movies and TV Shows Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Zone - Watch Free Movies & TV Shows Online",
    description:
      "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
    images: ["https://moviezone-inky.vercel.app/og-image.png"],
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
      description:
        "Discover and watch thousands of movies and TV shows for free. Stream the latest releases, classic films, and popular series without ads or interruptions.",
      url: "https://moviezone-inky.vercel.app/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://moviezone-inky.vercel.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "Movie Zone",
        url: "https://moviezone-inky.vercel.app/",
        logo: "https://moviezone-inky.vercel.app/logo.png",
      },
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
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="referrer" content="no-referrer-when-downgrade" />

        {/* Preconnect hints for faster resource loading */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Verification and language */}
        <meta name="google-site-verification" content="googleeefc2203045cdc48" />
        <meta httpEquiv="content-language" content="en,ar" />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SHSM2HT143"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SHSM2HT143');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="theme"
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen w-full">
                <div className="relative">
                  <div className="fixed top-0 left-0 w-full z-50">
                    <SidebarTrigger className="sidebar-trigger" />
                    <Navbar />
                  </div>
                </div>
                <AppSidebar />
                <div className="pt-16 min-h-[calc(100vh-5.07rem)]">
                  {children}
                </div>
                <div className="relative bottom-0 w-full">
                  <Footer />
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>

        {/* Google Analytics Route Tracker */}
        <Analytics />

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

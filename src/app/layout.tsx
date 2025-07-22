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
    "movies",
    "TV shows",
    "streaming",
    "entertainment",
    "free movies",
    "watch online",
    "cinema",
    "films",
    "series",
  ],
  authors: [{ name: "Mohamed Ali", url: "https://github.com/devbn3li/" }],
  alternates: {
    canonical: "https://moviezone.me/",
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
    url: "https://moviezone.me/",
    type: "website",
    siteName: "Movie Zone",
    images: [
      {
        url: "https://moviezone.me/og-image.png",
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
    images: ["https://moviezone.me/og-image.png"],
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
      url: "https://moviezone.me/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://moviezone.me/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "Movie Zone",
        url: "https://moviezone.me/",
        logo: "https://moviezone.me/logo.png",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PXH771LG5B"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PXH771LG5B');
            `,
          }}
        />
      </head>
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

        {/* Google Analytics Route Tracker */}
        <Analytics />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

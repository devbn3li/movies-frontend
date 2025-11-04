/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://moviezone.me",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/api/*",
    "/admin/*",
    "/dashboard",
    "/login",
    "/register",
    "/profile",
  ],
  additionalPaths: async () => {
    const now = new Date().toISOString();
    const paths = [
      {
        loc: "/",
        changefreq: "daily",
        priority: 1.0,
        lastmod: now,
      },
      {
        loc: "/main-movies",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: now,
      },
      {
        loc: "/main-series",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: now,
      },
    ];

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.warn(
          "⚠️  NEXT_PUBLIC_BASE_URL not found, skipping dynamic sitemap generation"
        );
        return paths;
      }

      // Helper function with aggressive timeout
      const fetchWithTimeout = (url, timeout = 15000) => {
        return Promise.race([
          fetch(url, {
            headers: { accept: "application/json" },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
          ),
        ]);
      };

      console.log("🚀 Fetching content for sitemap (limit: 50 each)...");
      const startTime = Date.now();

      // جلب عدد قليل جداً (50 فقط) عشان نتجنب الـ timeout
      const [moviesResponse, tvShowsResponse] = await Promise.allSettled([
        fetchWithTimeout(
          `${baseUrl}/movies-only?limit=50&sort_by=popularity&order=desc`
        ).catch((err) => {
          console.warn("⚠️  Movies request failed:", err.message);
          return null;
        }),
        fetchWithTimeout(
          `${baseUrl}/tvshows-only?limit=50&sort_by=popularity&order=desc`
        ).catch((err) => {
          console.warn("⚠️  TV shows request failed:", err.message);
          return null;
        }),
      ]);

      // معالجة الأفلام
      if (
        moviesResponse.status === "fulfilled" &&
        moviesResponse.value &&
        moviesResponse.value.ok
      ) {
        try {
          const moviesData = await moviesResponse.value.json();
          const movies = moviesData.movies || moviesData.data || [];

          movies.forEach((movie) => {
            if (movie.id || movie.tmdb_id) {
              const movieId = movie.id || movie.tmdb_id;
              paths.push({
                loc: `/movie/${movieId}`,
                changefreq: "weekly",
                priority: 0.8,
                lastmod: movie.updated_at || now,
              });
            }
          });

          console.log(`✅ Added ${movies.length} movies to sitemap`);
        } catch {
          console.warn("⚠️  Failed to parse movies response");
        }
      } else {
        console.warn("⚠️  Movies API unavailable - continuing without movies");
      }

      // معالجة المسلسلات
      if (
        tvShowsResponse.status === "fulfilled" &&
        tvShowsResponse.value &&
        tvShowsResponse.value.ok
      ) {
        try {
          const tvShowsData = await tvShowsResponse.value.json();
          const tvShows = tvShowsData.tvshows || tvShowsData.data || [];

          tvShows.forEach((show) => {
            if (show.id || show.tmdb_id) {
              const showId = show.id || show.tmdb_id;
              paths.push({
                loc: `/series/${showId}`,
                changefreq: "weekly",
                priority: 0.8,
                lastmod: show.updated_at || now,
              });
            }
          });

          console.log(`✅ Added ${tvShows.length} TV shows to sitemap`);
        } catch {
          console.warn("⚠️  Failed to parse TV shows response");
        }
      } else {
        console.warn(
          "⚠️  TV shows API unavailable - continuing without TV shows"
        );
      }

      const endTime = Date.now();
      console.log(
        `🎉 Sitemap generated with ${paths.length} entries (took ${
          (endTime - startTime) / 1000
        }s)`
      );
    } catch (error) {
      console.error("❌ Error generating dynamic sitemap:", error.message);
      console.log("📝 Continuing with basic sitemap only");
    }

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/login",
          "/register",
          "/profile",
        ],
      },
    ],
  },
};

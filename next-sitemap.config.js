/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://moviezone-inky.vercel.app/",
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
    return [
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

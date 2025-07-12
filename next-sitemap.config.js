/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://moviezonee.mooo.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/api/*", "/admin/*", "/dashboard", "/login", "/register", "/profile"],
  additionalPaths: async () => {
    const paths = [];

    // Add static pages with custom priority
    paths.push({
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    paths.push({
      loc: "/main-movies",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    paths.push({
      loc: "/main-series",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard", "/login", "/register", "/profile"],
      },
    ],
    additionalSitemaps: ["https://moviezonee.mooo.com/sitemap.xml"],
  },
};

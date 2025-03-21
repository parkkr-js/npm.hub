import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://npmhub.vercel.app";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/search/*", "/detail/*"],
        disallow: ["/api/*", "/_next/*", "/static/*"],
      },
      {
        userAgent: "*",
        allow: ["/", "/search/*", "/detail/*"],
        disallow: ["/api/*", "/_next/*", "/static/*"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,

    host: baseUrl,
  };
}

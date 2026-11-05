import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Blocks Google from crawling your admin dashboard
    },
    sitemap: "https://www.realise-reality.org/sitemap.xml",
  };
}
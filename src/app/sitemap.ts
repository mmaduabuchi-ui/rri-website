import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.realise-reality.org";

  // 1. Fetch all published articles to add to the sitemap
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, created_at")
    .eq("status", "published");

  const articleUrls = (articles || []).map((article) => ({
    url: `${baseUrl}/insights/${article.id}`,
    lastModified: new Date(article.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 2. Static pages
  const staticUrls = [
    "",
    "/insights",
    "/contact",
    "/get-involved",
    "/welfare",
    "/events",
    "/partnerships",
    "/global-presence",
    "/knowledge-centre",
    "/privacy-policy",
    "/terms",
    "/code-of-conduct",
    "/safeguarding",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...articleUrls];
}
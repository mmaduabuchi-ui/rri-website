// src/lib/articles.ts
import { createClient } from "@/lib/supabase/server";

export type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  kind: string | null;
  category: string | null;
  cover_url: string | null;
  created_at: string;
};

export async function getArticles(limit?: number): Promise<Article[]> {
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("id, title, excerpt, body, kind, category, cover_url, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getArticles failed:", error.message);
    return [];
  }

  return (data ?? []) as Article[];
}
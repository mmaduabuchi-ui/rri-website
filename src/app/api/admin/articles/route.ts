// src/app/api/admin/articles/route.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedKinds = ["article", "news", "announcement", "emergency"] as const;
const allowedMediaTypes = ["none", "image", "video", "audio", "link"] as const;

type ArticleInput = {
  title: string;
  excerpt: string;
  body: string;
  kind: (typeof allowedKinds)[number];
  category: string;
  cover_url: string;
  media_type: (typeof allowedMediaTypes)[number];
  media_url: string;
  media_caption: string;
  published: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseArticleInput(value: unknown): ArticleInput | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    title,
    excerpt,
    body,
    kind,
    category,
    cover_url,
    media_type,
    media_url,
    media_caption,
    published,
  } = value;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof body !== "string" ||
    !body.trim() ||
    typeof excerpt !== "string" ||
    typeof category !== "string" ||
    typeof cover_url !== "string" ||
    typeof published !== "boolean" ||
    typeof kind !== "string" ||
    !allowedKinds.includes(kind as ArticleInput["kind"]) ||
    typeof media_type !== "string" ||
    !allowedMediaTypes.includes(media_type as ArticleInput["media_type"]) ||
    typeof media_url !== "string" ||
    typeof media_caption !== "string"
  ) {
    return null;
  }

  return {
    title: title.trim(),
    excerpt,
    body,
    kind: kind as ArticleInput["kind"],
    category,
    cover_url,
    media_type: media_type as ArticleInput["media_type"],
    media_url,
    media_caption,
    published,
  };
}

export async function POST(request: Request) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    return Response.json(
      { error: `Unable to verify your session: ${authError.message}` },
      { status: 500 },
    );
  }
  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return Response.json(
      { error: `Unable to verify administrator access: ${profileError.message}` },
      { status: 500 },
    );
  }
  if (profile?.role !== "admin") {
    return Response.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const article = parseArticleInput(body);
  if (!article) {
    return Response.json(
      { error: "Invalid article data. Check the required fields and values." },
      { status: 400 },
    );
  }

  const { data: createdArticle, error: insertError } = await createAdminClient()
    .from("articles")
    .insert({
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      kind: article.kind,
      category: article.category,
      cover_url: article.cover_url,
      media_type: article.media_type,
      media_url: article.media_url || null,
      media_caption: article.media_caption || null,
      status: article.published ? "published" : "draft",
    })
    .select()
    .single();

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 400 });
  }

  return Response.json(createdArticle, { status: 201 });
}
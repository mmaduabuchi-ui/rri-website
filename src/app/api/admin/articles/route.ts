import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedKinds = ["article", "news", "announcement", "emergency"] as const;

type ArticleInput = {
  title: string;
  excerpt: string;
  body: string;
  kind: (typeof allowedKinds)[number];
  category: string;
  cover_url: string;
  published: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseArticleInput(value: unknown): ArticleInput | null {
  if (!isRecord(value)) {
    return null;
  }

  const { title, excerpt, body, kind, category, cover_url, published } = value;
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
    !allowedKinds.includes(kind as ArticleInput["kind"])
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
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
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
      status: article.published ? "published" : "draft",
    })
    .select()
    .single();

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 400 });
  }

  return Response.json(createdArticle, { status: 201 });
}

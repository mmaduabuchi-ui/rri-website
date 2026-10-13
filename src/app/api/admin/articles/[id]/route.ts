import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedKinds = ["article", "news", "announcement", "emergency"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    return Response.json(
      { error: `Unable to verify your session: ${authError.message}` },
      { status: 400 },
    );
  }
  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 400 });
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return Response.json(
      { error: `Unable to verify administrator access: ${profileError.message}` },
      { status: 400 },
    );
  }
  if (profile?.role !== "admin") {
    return Response.json({ error: "Administrator access required." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return Response.json({ error: "Invalid article data." }, { status: 400 });
  }

  const { title, excerpt, body, kind, category, cover_url, published } = payload;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof excerpt !== "string" ||
    typeof body !== "string" ||
    !body.trim() ||
    typeof kind !== "string" ||
    !allowedKinds.includes(kind as (typeof allowedKinds)[number]) ||
    typeof category !== "string" ||
    typeof cover_url !== "string" ||
    typeof published !== "boolean"
  ) {
    return Response.json(
      { error: "Invalid article data. Check the required fields and values." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const { data: article, error: updateError } = await createAdminClient()
    .from("articles")
    .update({
      title: title.trim(),
      excerpt,
      body,
      kind,
      category,
      cover_url,
      status: published ? "published" : "draft",
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }
  if (!article) {
    return Response.json({ error: "Article not found." }, { status: 400 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    return Response.json(
      { error: `Unable to verify your session: ${authError.message}` },
      { status: 400 },
    );
  }
  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 400 });
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return Response.json(
      { error: `Unable to verify administrator access: ${profileError.message}` },
      { status: 400 },
    );
  }
  if (profile?.role !== "admin") {
    return Response.json({ error: "Administrator access required." }, { status: 400 });
  }

  const { id } = await params;
  const { data: deletedArticle, error: deleteError } = await createAdminClient()
    .from("articles")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 400 });
  }
  if (!deletedArticle) {
    return Response.json({ error: "Article not found." }, { status: 400 });
  }

  return Response.json({ ok: true });
}

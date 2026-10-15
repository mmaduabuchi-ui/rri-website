// src/app/api/admin/products/[id]/route.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const productTypes = ["free", "paid", "donation"] as const;
const mediaTypes = ["video", "audio", "text", "link"] as const;

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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }
  if (!isRecord(payload)) {
    return Response.json({ error: "Invalid product data." }, { status: 400 });
  }

  const { title, type, media_type } = payload;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof type !== "string" ||
    !productTypes.includes(type as (typeof productTypes)[number]) ||
    typeof media_type !== "string" ||
    !mediaTypes.includes(media_type as (typeof mediaTypes)[number])
  ) {
    return Response.json(
      { error: "Invalid product data. Check the required fields and values." },
      { status: 400 },
    );
  }

  const body = {
    title: title.trim(),
    description:
      typeof payload.description === "string" ? payload.description : "",
    type,
    media_type,
    price:
      typeof payload.price === "number" && Number.isFinite(payload.price)
        ? payload.price
        : null,
    cover_url: typeof payload.cover_url === "string" ? payload.cover_url : "",
    content: typeof payload.content === "string" ? payload.content : null,
    external_url:
      typeof payload.external_url === "string" ? payload.external_url : null,
    storage_path:
      typeof payload.storage_path === "string" ? payload.storage_path : null,
  };

  const { id } = await params;
  const { data: product, error: updateError } = await createAdminClient()
    .from("products")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }

  return Response.json(product);
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

  const { id } = await params;
  const { error: deleteError } = await createAdminClient()
    .from("products")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
// src/app/api/admin/access/route.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) return null;

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return null;
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { userId, productId } = payload as Record<string, unknown>;

  if (typeof userId !== "string" || !userId) {
    return Response.json({ error: "userId is required." }, { status: 400 });
  }
  if (typeof productId !== "string" || !productId) {
    return Response.json({ error: "productId is required." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Insert if not already present.
  const { error: insertError } = await admin
    .from("product_access")
    .upsert(
      { user_id: userId, product_id: productId },
      { onConflict: "user_id,product_id", ignoreDuplicates: true },
    );

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 400 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { userId, productId } = payload as Record<string, unknown>;

  if (typeof userId !== "string" || typeof productId !== "string") {
    return Response.json(
      { error: "userId and productId are required." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error: deleteError } = await admin
    .from("product_access")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
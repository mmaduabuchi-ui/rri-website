// src/app/api/admin/settings/route.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_KEYS = [
  "admin_email",
  "admin_whatsapp",
  "payment_bank",
  "payment_account",
  "payment_name",
] as const;

type AllowedKey = (typeof ALLOWED_KEYS)[number];

function isAllowedKey(value: string): value is AllowedKey {
  return (ALLOWED_KEYS as readonly string[]).includes(value);
}

export async function PATCH(request: Request) {
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

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates = payload as Record<string, unknown>;
  const rows: Array<{ key: string; value: string }> = [];

  for (const [key, value] of Object.entries(updates)) {
    if (!isAllowedKey(key)) {
      return Response.json(
        { error: `Unknown or forbidden settings key: ${key}` },
        { status: 400 },
      );
    }
    if (typeof value !== "string") {
      return Response.json(
        { error: `Value for ${key} must be a string.` },
        { status: 400 },
      );
    }
    rows.push({ key, value });
  }

  if (rows.length === 0) {
    return Response.json({ ok: true, updated: 0 });
  }

  const admin = createAdminClient();

  // Upsert each row so it also works if a key was deleted by mistake.
  for (const row of rows) {
    const { error: upsertError } = await admin
      .from("settings")
      .upsert(
        { key: row.key, value: row.value, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );

    if (upsertError) {
      return Response.json(
        { error: `Failed to update ${row.key}: ${upsertError.message}` },
        { status: 500 },
      );
    }
  }

  return Response.json({ ok: true, updated: rows.length });
}
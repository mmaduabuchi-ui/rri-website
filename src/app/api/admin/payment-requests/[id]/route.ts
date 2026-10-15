// src/app/api/admin/payment-requests/[id]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const authClient = await createClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return null;
  return user;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Request ID is required." },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { action } = payload as Record<string, unknown>;
  if (action !== "approve" && action !== "dismiss") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'dismiss'." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: req, error: loadError } = await admin
    .from("payment_requests")
    .select("id, user_id, product_id, status")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json(
      { error: `Unable to load request: ${loadError.message}` },
      { status: 500 },
    );
  }
  if (!req) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }
  if (req.status !== "pending") {
    return NextResponse.json(
      { error: `This request was already ${req.status}.` },
      { status: 409 },
    );
  }

  if (action === "approve") {
    const { error: grantError } = await admin
      .from("product_access")
      .upsert(
        {
          user_id: req.user_id,
          product_id: req.product_id,
          granted_by: adminUser.id,
        },
        { onConflict: "user_id,product_id", ignoreDuplicates: true },
      );

    if (grantError) {
      return NextResponse.json(
        { error: `Unable to grant access: ${grantError.message}` },
        { status: 500 },
      );
    }
  }

  const { error: updateError } = await admin
    .from("payment_requests")
    .update({
      status: action === "approve" ? "approved" : "dismissed",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: `Unable to update request: ${updateError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
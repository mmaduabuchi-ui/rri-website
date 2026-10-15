// src/app/api/payment-requests/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to submit a payment request." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { productId, note } = body as Record<string, unknown>;

  if (typeof productId !== "string" || !productId) {
    return NextResponse.json(
      { error: "productId is required." },
      { status: 400 },
    );
  }

  const cleanNote =
    typeof note === "string" ? note.trim().slice(0, 1000) : "";

  // Reject duplicate pending requests for the same user + product.
  const { data: existing, error: existingError } = await supabase
    .from("payment_requests")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: `Unable to check existing requests: ${existingError.message}` },
      { status: 500 },
    );
  }

  if (existing) {
    return NextResponse.json(
      {
        error:
          "You already have a pending request for this product. Please wait for admin approval.",
      },
      { status: 409 },
    );
  }

  const { data: created, error: insertError } = await supabase
    .from("payment_requests")
    .insert({
      user_id: user.id,
      product_id: productId,
      note: cleanNote || null,
      status: "pending",
    })
    .select("id, status, created_at")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: `Unable to submit request: ${insertError.message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, request: created }, { status: 201 });
}
// src/app/api/chat/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_LENGTH = 2000;

async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, user } = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Message ID is required." },
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

  const { body } = payload as Record<string, unknown>;
  if (typeof body !== "string") {
    return NextResponse.json(
      { error: "Message body must be a string." },
      { status: 400 },
    );
  }

  const trimmed = body.trim();
  if (trimmed.length === 0) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 },
    );
  }
  if (trimmed.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long. Maximum ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // RLS enforces auth.uid() = sender_id for updates.
  // The .eq("sender_id", user.id) is defense-in-depth.
  const { data: updated, error: updateError } = await supabase
    .from("messages")
    .update({ body: trimmed })
    .eq("id", id)
    .eq("sender_id", user.id)
    .select("id, sender_id, body, created_at")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json(
      { error: `Unable to edit message: ${updateError.message}` },
      { status: 400 },
    );
  }

  if (!updated) {
    return NextResponse.json(
      { error: "Message not found, or you do not have permission to edit it." },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, message: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, user, isAdmin } = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Message ID is required." },
      { status: 400 },
    );
  }

  const { data: msg, error: loadError } = await supabase
    .from("messages")
    .select("id, sender_id")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json(
      { error: `Unable to load message: ${loadError.message}` },
      { status: 500 },
    );
  }

  if (!msg) {
    return NextResponse.json(
      { error: "Message not found." },
      { status: 404 },
    );
  }

  const isAuthor = msg.sender_id === user.id;
  if (!isAuthor && !isAdmin) {
    return NextResponse.json(
      { error: "You can only delete your own messages." },
      { status: 403 },
    );
  }

  const { error: deleteError } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: `Unable to delete message: ${deleteError.message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
// src/app/api/chat/send/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_LENGTH = 2000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to send messages." },
      { status: 401 },
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

  const { data: created, error: insertError } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, body: trimmed })
    .select("id, sender_id, body, created_at")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: `Unable to send message: ${insertError.message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, message: created }, { status: 201 });
}
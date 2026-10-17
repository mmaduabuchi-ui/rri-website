// src/app/api/admin/articles/upload/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB for images
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function sanitize(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150);
}

export async function POST(request: Request) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Request must be multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large. Maximum is 10 MB." },
      { status: 413 },
    );
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPG, PNG, WebP, or GIF." },
      { status: 415 },
    );
  }

  const admin = createAdminClient();
  const safeName = sanitize(file.name || "image");
  const finalName = `${Date.now()}-${safeName}`;

  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("article-media")
    .upload(finalName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }

  const { data: publicUrl } = admin.storage
    .from("article-media")
    .getPublicUrl(finalName);

  return NextResponse.json({
    path: finalName,
    url: publicUrl.publicUrl,
    size: file.size,
    type: file.type,
  });
}
// src/app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "audio/mpeg", // .mp3
  "audio/mp4", // .m4a
  "audio/wav",
  "audio/ogg",
  "application/pdf",
];

const bucketByProductType: Record<string, string> = {
  free: "free-products",
  paid: "paid-products",
  donation: "donation-products",
};

function sanitizeFilename(name: string): string {
  // Replace anything that is not alphanumeric, dot, dash, or underscore.
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

export async function POST(request: Request) {
  // 1. Auth check — admin only.
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

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: `Unable to verify admin access: ${profileError.message}` },
      { status: 500 },
    );
  }
  if (profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  }

  // 2. Parse the multipart body.
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
  const productId = form.get("productId");
  const productType = form.get("productType");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "A file is required." },
      { status: 400 },
    );
  }
  if (typeof productId !== "string" || !productId) {
    return NextResponse.json(
      { error: "productId is required." },
      { status: 400 },
    );
  }
  if (typeof productType !== "string" || !bucketByProductType[productType]) {
    return NextResponse.json(
      { error: "productType must be 'free', 'paid', or 'donation'." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `File is too large. Maximum is 50 MB.` },
      { status: 413 },
    );
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported file type (${file.type}). Allowed: MP4, WebM, MOV, MP3, M4A, WAV, OGG, PDF.`,
      },
      { status: 415 },
    );
  }

  // 3. Build the destination path.
  const bucket = bucketByProductType[productType];
  const safeOriginal = sanitizeFilename(file.name || "upload");
  const finalName = `${productId}-${safeOriginal}`;

  // 4. Upload via service role (bypasses storage RLS).
  const admin = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();

  const { data: uploaded, error: uploadError } = await admin.storage
    .from(bucket)
    .upload(finalName, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError || !uploaded) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError?.message ?? "unknown error"}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    bucket,
    path: uploaded.path,
    name: finalName,
    size: file.size,
    type: file.type,
  });
}
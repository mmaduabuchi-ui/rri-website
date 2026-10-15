// src/app/api/product-access/[productId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_TTL_SECONDS = 60;

const bucketByType: Record<string, string> = {
  free: "free-products",
  paid: "paid-products",
  donation: "donation-products",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  if (!productId) {
    return NextResponse.json(
      { error: "A product ID is required." },
      { status: 400 },
    );
  }

  // 1. Require a signed-in user.
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

  // 2. Load product using service role (so we can read storage_path).
  const admin = createAdminClient();
  const { data: product, error: productError } = await admin
    .from("products")
    .select("id, type, media_type, storage_path, external_url")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    return NextResponse.json(
      { error: `Unable to load product: ${productError.message}` },
      { status: 500 },
    );
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  // 3. Access check.
  if (product.type !== "free") {
    const { data: profile } = await authClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin) {
      const { data: access, error: accessError } = await admin
        .from("product_access")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (accessError) {
        return NextResponse.json(
          { error: `Unable to verify access: ${accessError.message}` },
          { status: 500 },
        );
      }

      if (!access) {
        return NextResponse.json(
          { error: "You do not have access to this product." },
          { status: 403 },
        );
      }
    }
  }

  // 4. Link products: no signed URL needed; hand back the external URL.
  if (product.media_type === "link") {
    if (!product.external_url) {
      return NextResponse.json(
        { error: "This product has no external URL set." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      mediaType: "link",
      externalUrl: product.external_url,
    });
  }

  // 5. Text products: no signed URL, the content is fetched separately.
  if (product.media_type === "text") {
    return NextResponse.json({ mediaType: "text" });
  }

  // 6. Video/audio: sign a 60-second URL from the correct bucket.
  if (!product.storage_path) {
    return NextResponse.json(
      { error: "This product has no attached file." },
      { status: 404 },
    );
  }

  const bucket = bucketByType[product.type as string];
  if (!bucket) {
    return NextResponse.json(
      { error: `Unsupported product type: ${product.type}` },
      { status: 400 },
    );
  }

  const { data: signed, error: signError } = await admin.storage
    .from(bucket)
    .createSignedUrl(product.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      {
        error: `Unable to generate playback link: ${
          signError?.message ?? "unknown error"
        }`,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    mediaType: product.media_type,
    signedUrl: signed.signedUrl,
    expiresIn: SIGNED_URL_TTL_SECONDS,
  });
}
// src/app/knowledge-centre/[productId]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import ProductPlayer from "@/components/knowledge/ProductPlayer";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ productId: string }>;
};

type SafeProduct = {
  id: string;
  title: string;
  description: string | null;
  type: "free" | "paid" | "donation";
  media_type: "video" | "audio" | "text" | "link" | null;
  cover_url: string | null;
  content: string | null;
  external_url: string | null;
  storage_path: string | null;
  has_access: boolean;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Read from products_safe so RLS-aware nulling applies.
  const { data: product, error } = await supabase
    .from("products_safe")
    .select(
      "id, title, description, type, media_type, cover_url, content, external_url, storage_path, has_access",
    )
    .eq("id", productId)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const p = product as SafeProduct;

  // Access gate: if there is no access, show a locked page (do not redirect,
  // so people understand why they cannot view it).
  if (!p.has_access && p.type !== "free") {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-4 py-16 sm:px-6 lg:px-8">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl text-[#F7B500]">
              🔒
            </div>
            <h1 className="mt-5 text-2xl font-bold text-[#0B1B3D] sm:text-3xl">
              This resource is locked.
            </h1>
            <p className="mt-4 leading-7 text-gray-600">
              {user
                ? "You do not have access to this resource yet. Contact RRI to request access."
                : "Sign in to your account to view this resource, or contact RRI to request access."}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {!user && (
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/knowledge-centre"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#1E824C] px-7 py-3.5 font-semibold text-[#1E824C] transition-colors hover:bg-[#1E824C] hover:text-white"
              >
                Back to Knowledge Centre
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // Determine the effective media type. If media_type is missing, infer.
  const mediaType =
    p.media_type ??
    (p.content ? "text" : p.external_url ? "link" : "text");

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-12 sm:px-6 lg:px-8">
      <Container>
        <div className="mx-auto max-w-4xl">
          <Link
            href="/knowledge-centre"
            className="text-sm font-semibold text-[#1E824C] hover:underline"
          >
            ← Back to Knowledge Centre
          </Link>

          <header className="mt-6 mb-8">
            <span className="inline-flex rounded-full bg-[#0B1B3D] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F7B500]">
              {p.type}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0B1B3D] sm:text-4xl">
              {p.title}
            </h1>
            {p.description && (
              <p className="mt-4 text-base leading-8 text-gray-600">
                {p.description}
              </p>
            )}
          </header>

          <div className="mt-8">
            <ProductPlayer
              productId={p.id}
              mediaType={mediaType as "video" | "audio" | "text" | "link"}
              textContent={p.content}
              title={p.title}
            />
          </div>

          <p className="mt-10 text-xs leading-6 text-gray-500">
            Streaming links for this resource expire after 60 seconds. If the
            player stops working after being idle, reload the page to renew
            access.
          </p>
        </div>
      </Container>
    </main>
  );
}
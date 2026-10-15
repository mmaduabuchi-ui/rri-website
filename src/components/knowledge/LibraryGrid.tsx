"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type Props = {
  items: Product[];
  isSignedIn: boolean;
};

const typeLabels: Record<string, string> = {
  free: "Free",
  paid: "Paid",
  donation: "Donation",
};

/**
 * Returns true only when `value` is a valid absolute http(s) URL.
 * Guards against malformed data like "http:/ffghhh" that would otherwise
 * crash next/image or render a broken link.
 */
function isValidUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Picks the right action label based on how the product is consumed.
 */
function actionLabel(mediaType: string | null | undefined): string {
  switch (mediaType) {
    case "video":
      return "Watch";
    case "audio":
      return "Listen";
    case "link":
      return "Open Resource";
    case "text":
    default:
      return "Read";
  }
}

export default function LibraryGrid({ items, isSignedIn }: Props) {
  const [filter, setFilter] = useState<"all" | "free" | "paid" | "donation">(
    "all",
  );

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  const filterButtons = [
    { value: "all", label: "All Resources" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
    { value: "donation", label: "Donation" },
  ] as const;

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            type="button"
            onClick={() => setFilter(btn.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === btn.value
                ? "bg-[#0B1B3D] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No resources available in this category yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isSignedIn={isSignedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  isSignedIn,
}: {
  product: Product;
  isSignedIn: boolean;
}) {
  const isLocked = !product.has_access && product.type !== "free";
  const hasValidCover = isValidUrl(product.cover_url);
  const label = actionLabel(product.media_type);
  const detailHref = `/knowledge-centre/${product.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-4/3 w-full bg-[#F5F7FA]">
        {hasValidCover ? (
          <Image
            src={product.cover_url as string}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            📖
          </div>
        )}

        <span className="absolute top-3 left-3 rounded-full bg-[#0B1B3D] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F7B500]">
          {typeLabels[product.type] ?? product.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-[#0B1B3D]">
          {product.title}
        </h3>

        {product.description && (
          <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
            {product.description}
          </p>
        )}

        {isLocked ? (
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-xs font-semibold text-[#B45309]">
              {isSignedIn
                ? "You do not have access to this resource yet."
                : "Sign in or unlock to access this resource."}
            </p>
            {isSignedIn ? (
              <Link
                href={detailHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300"
              >
                🔒 View details
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F7B500] px-5 py-2.5 text-sm font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
              >
                Sign in to unlock
              </Link>
            )}
          </div>
        ) : (
          <Link
            href={detailHref}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E824C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16663A]"
          >
            {label}
          </Link>
        )}
      </div>
    </article>
  );
}
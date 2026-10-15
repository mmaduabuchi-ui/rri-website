"use client";

import Image from "next/image";
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

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-4/3 w-full bg-[#F5F7FA]">
        {product.cover_url ? (
          <Image
            src={product.cover_url}
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
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500"
            >
              🔒 Locked
            </button>
          </div>
        ) : product.type === "paid" && !isSignedIn ? (
          <a
            href="/login"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F7B500] px-5 py-2.5 text-sm font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
          >
            Unlock
          </a>
        ) : product.storage_path ? (
          <a
            href={`/api/download/${product.id}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E824C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16663A]"
          >
            Download
          </a>
        ) : product.external_url ? (
          <a
            href={product.external_url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E824C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16663A]"
          >
            Open Resource
          </a>
        ) : product.content ? (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-semibold text-[#1E824C] hover:underline">
              Read content
            </summary>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {product.content}
            </div>
          </details>
        ) : (
          <p className="mt-6 text-xs text-gray-400">
            No file attached yet.
          </p>
        )}
      </div>
    </article>
  );
}
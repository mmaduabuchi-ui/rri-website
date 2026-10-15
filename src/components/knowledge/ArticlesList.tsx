"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/articles";

type Props = {
  items: Article[];
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ArticlesList({ items }: Props) {
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (category === "All") return items;
    return items.filter((a) => a.category === category);
  }, [items, category]);

  if (items.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-gray-500">
        No articles published yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              category === cat
                ? "bg-[#0B1B3D] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No articles in this category yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {article.cover_url && (
                <div className="relative aspect-video w-full bg-[#F5F7FA]">
                  <Image
                    src={article.cover_url}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs">
                  {article.category && (
                    <span className="rounded-full bg-[#1E824C]/10 px-3 py-1 font-semibold text-[#1E824C]">
                      {article.category}
                    </span>
                  )}
                  <span className="text-gray-400">
                    {formatDate(article.created_at)}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-snug text-[#0B1B3D]">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {article.excerpt}
                  </p>
                )}

                <Link
                  href={`/insights/${article.id}`}
                  className="mt-5 inline-flex items-center font-semibold text-[#1E824C] hover:underline"
                >
                  Read more <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
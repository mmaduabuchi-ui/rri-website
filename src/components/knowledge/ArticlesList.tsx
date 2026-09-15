"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { articles, articleCategories, type Article } from "@/data/articles";

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

export default function ArticlesList() {
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (category === "All") return sorted;
    return sorted.filter((a) => a.category === category);
  }, [category]);

  return (
    <div className="mt-12">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {articleCategories.map((cat) => (
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

      {/* List */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No articles in this category yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {article.cover && (
        <div className="relative aspect-video w-full bg-[#F5F7FA]">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-[#1E824C]/10 px-3 py-1 font-semibold text-[#1E824C]">
            {article.category}
          </span>
          <span className="text-gray-400">{formatDate(article.date)}</span>
        </div>

        <h3 className="mt-4 text-xl font-bold leading-snug text-[#0B1B3D]">
          {article.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span className="font-semibold text-[#0B1B3D]">{article.author}</span>
          {article.readingMinutes && (
            <span>{article.readingMinutes} min read</span>
          )}
        </div>
      </div>
    </article>
  );
}
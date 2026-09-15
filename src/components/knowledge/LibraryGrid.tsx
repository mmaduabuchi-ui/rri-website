"use client";

import Image from "next/image";
import { useState } from "react";
import { library, libraryTypes, type LibraryItem } from "@/data/library";

const typeLabels: Record<LibraryItem["type"], string> = {
  book: "Book",
  ebook: "E-Book",
  workbook: "Workbook",
  guide: "Guide",
  report: "Report",
};

export default function LibraryGrid() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? library : library.filter((item) => item.type === filter);

  return (
    <div className="mt-12">
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {libraryTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setFilter(type.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === type.value
                ? "bg-[#0B1B3D] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No resources in this category yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Cover */}
              <div className="relative aspect-4/3 w-full bg-[#F5F7FA]">
                {item.cover ? (
                  <Image
                    src={item.cover}
                    alt={item.title}
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
                  {typeLabels[item.type]}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold leading-snug text-[#0B1B3D]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1E824C]">
                  {item.author}
                </p>

                <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F5F7FA] px-2.5 py-0.5 text-[10px] font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={item.fileUrl || "#"}
                  download
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E824C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
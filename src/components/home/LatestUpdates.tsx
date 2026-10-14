import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LatestUpdates() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, kind, excerpt, created_at, status")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1E824C]">
              Knowledge Centre
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
              Latest Updates
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Explore the latest articles, announcements and insights from
              Realise Reality Initiative.
            </p>
          </div>

          <Link
            href="/knowledge-centre"
            className="inline-flex w-fit items-center font-semibold text-[#1E824C] hover:underline"
          >
            View all updates <span className="ml-2">→</span>
          </Link>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
          >
            <h3 className="font-semibold">
              Updates are temporarily unavailable
            </h3>
            <p className="mt-1 text-sm">Please try again later.</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <article
                key={article.id}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1E824C]">
                  {article.kind || "Update"}
                </p>

                <h3 className="mt-3 text-lg font-bold leading-snug text-[#0B1B3D]">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {article.excerpt}
                  </p>
                )}

                <p className="mt-4 text-xs text-gray-500">
                  {new Date(article.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>

                <Link
                  href={`/knowledge-centre/articles/${article.id}`}
                  className="mt-5 inline-flex items-center font-semibold text-[#1E824C] hover:underline"
                >
                  Read more <span className="ml-2">→</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-[#0B1B3D]">
              No updates published yet
            </h3>
            <p className="mt-2 text-gray-600">
              Please check back soon for the latest news and insights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
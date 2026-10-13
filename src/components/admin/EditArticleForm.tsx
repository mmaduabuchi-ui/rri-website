"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ArticleKind = "article" | "news" | "announcement" | "emergency";

export type EditableArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  kind: ArticleKind;
  category: string | null;
  cover_url: string | null;
  status: string;
};

export default function EditArticleForm({
  article,
}: {
  article: EditableArticle;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [body, setBody] = useState(article.body);
  const [kind, setKind] = useState<ArticleKind>(article.kind);
  const [category, setCategory] = useState(article.category ?? "");
  const [coverUrl, setCoverUrl] = useState(article.cover_url ?? "");
  const [published, setPublished] = useState(article.status === "published");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          body,
          kind,
          category,
          cover_url: coverUrl,
          published,
        }),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to update the post. Please try again.";
        setErrorMessage(message);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update the post. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setErrorMessage("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to delete the post. Please try again.";
        setErrorMessage(message);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete the post. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]";
  const labelClassName = "block text-sm font-semibold text-[#0B1B3D]";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/admin/articles"
            className="text-sm font-semibold text-[#0B1B3D] hover:underline"
          >
            &larr; Back to articles
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Edit Post
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 border-t-4 border-t-[#1E824C] bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="title" className={labelClassName}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClassName}>
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="body" className={labelClassName}>
              Body
            </label>
            <textarea
              id="body"
              name="body"
              rows={10}
              required
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="kind" className={labelClassName}>
                Kind
              </label>
              <select
                id="kind"
                name="kind"
                value={kind}
                onChange={(event) => setKind(event.target.value as ArticleKind)}
                className={inputClassName}
              >
                <option value="article">Article</option>
                <option value="news">News</option>
                <option value="announcement">Announcement</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className={labelClassName}>
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cover_url" className={labelClassName}>
              Cover image URL
            </label>
            <input
              id="cover_url"
              name="cover_url"
              type="text"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              className={inputClassName}
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="published"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#0B1B3D] focus:ring-[#F7B500]"
            />
            Published
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 font-bold text-[#0B1B3D] transition hover:bg-[#dca200] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B3D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            className="ml-3 inline-flex min-h-12 items-center justify-center rounded-lg border border-red-300 px-6 py-3 font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>
    </main>
  );
}

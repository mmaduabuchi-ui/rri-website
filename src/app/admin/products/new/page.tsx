"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FileUploadField from "@/components/admin/FileUploadField";

type ProductType = "free" | "paid" | "donation";
type MediaType = "video" | "audio" | "text" | "link";

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProductType>("free");
  const [mediaType, setMediaType] = useState<MediaType>("text");
  const [price, setPrice] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A stable product ID for this session. Generated once on mount.
  const [draftProductId] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          media_type: mediaType,
          price: type === "free" ? null : Number(price),
          cover_url: coverUrl,
          content: mediaType === "text" ? content : null,
          external_url: mediaType === "link" ? externalUrl : null,
          storage_path:
            mediaType === "video" ||
            mediaType === "audio" ||
            mediaType === "text"
              ? storagePath
              : null,
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
            : "Unable to create the product. Please try again.";
        setErrorMessage(message);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
            href="/admin/products"
            className="text-sm font-semibold text-[#0B1B3D] hover:underline"
          >
            &larr; Back to products
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            New Product
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
            <label htmlFor="description" className={labelClassName}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className={labelClassName}>
                Type
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as ProductType)}
                className={inputClassName}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="donation">Donation</option>
              </select>
            </div>

            <div>
              <label htmlFor="media_type" className={labelClassName}>
                Media type
              </label>
              <select
                id="media_type"
                name="media_type"
                value={mediaType}
                onChange={(event) =>
                  setMediaType(event.target.value as MediaType)
                }
                className={inputClassName}
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="link">Link</option>
              </select>
            </div>
          </div>

          {type !== "free" && (
            <div>
              <label htmlFor="price" className={labelClassName}>
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClassName}
              />
            </div>
          )}

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

          {mediaType === "text" && (
            <>
              <div>
                <label htmlFor="content" className={labelClassName}>
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <FileUploadField
                productId={draftProductId}
                productType={type}
                accept="application/pdf"
                label="Optional PDF attachment"
                hint="Attach a downloadable PDF version of this content (max 50 MB)."
                currentPath={storagePath}
                onUploaded={(path) => setStoragePath(path)}
              />
            </>
          )}

          {mediaType === "video" && (
            <FileUploadField
              productId={draftProductId}
              productType={type}
              accept="video/mp4,video/webm,video/quicktime"
              label="Video file"
              hint="MP4, WebM, or MOV. Max 50 MB."
              currentPath={storagePath}
              onUploaded={(path) => setStoragePath(path)}
            />
          )}

          {mediaType === "audio" && (
            <FileUploadField
              productId={draftProductId}
              productType={type}
              accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg"
              label="Audio file"
              hint="MP3, M4A, WAV, or OGG. Max 50 MB."
              currentPath={storagePath}
              onUploaded={(path) => setStoragePath(path)}
            />
          )}

          {mediaType === "link" && (
            <div>
              <label htmlFor="external_url" className={labelClassName}>
                External URL
              </label>
              <input
                id="external_url"
                name="external_url"
                type="url"
                value={externalUrl}
                onChange={(event) => setExternalUrl(event.target.value)}
                className={inputClassName}
              />
            </div>
          )}

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
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 font-bold text-[#0B1B3D] transition hover:bg-[#dca200] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B3D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating product..." : "Create product"}
          </button>
        </form>
      </div>
    </main>
  );
}
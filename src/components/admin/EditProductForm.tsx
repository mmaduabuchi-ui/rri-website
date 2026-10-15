"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FileUploadField from "@/components/admin/FileUploadField";

type ProductType = "free" | "paid" | "donation";
type MediaType = "video" | "audio" | "text" | "link";

export type EditableProduct = {
  id: string;
  title: string;
  description: string | null;
  type: ProductType;
  media_type: MediaType | null;
  media?: MediaType | null;
  price: number | null;
  cover_url: string | null;
  content: string | null;
  external_url: string | null;
  storage_path: string | null;
};

export default function EditProductForm({
  product,
}: {
  product: EditableProduct;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description ?? "");
  const [type, setType] = useState<ProductType>(product.type);
  const [mediaType, setMediaType] = useState<MediaType>(
    product.media_type ?? product.media ?? "text",
  );
  const [price, setPrice] = useState(
    product.price == null ? "" : String(product.price),
  );
  const [coverUrl, setCoverUrl] = useState(product.cover_url ?? "");
  const [content, setContent] = useState(product.content ?? "");
  const [externalUrl, setExternalUrl] = useState(product.external_url ?? "");
  const [storagePath, setStoragePath] = useState<string | null>(
    product.storage_path,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
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
          storage_path: storagePath,
        }),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        setErrorMessage(
          typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
            ? result.error
            : "Unable to update product.",
        );
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]";
  const labelClass = "block text-sm font-semibold text-[#0B1B3D]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) => setType(event.target.value as ProductType)}
            className={fieldClass}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="donation">Donation</option>
          </select>
        </div>
        <div>
          <label htmlFor="media_type" className={labelClass}>
            Media type
          </label>
          <select
            id="media_type"
            value={mediaType}
            onChange={(event) => setMediaType(event.target.value as MediaType)}
            className={fieldClass}
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
          <label htmlFor="price" className={labelClass}>
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="cover_url" className={labelClass}>
          Cover image URL
        </label>
        <input
          id="cover_url"
          value={coverUrl}
          onChange={(event) => setCoverUrl(event.target.value)}
          className={fieldClass}
        />
      </div>

      {mediaType === "text" && (
        <>
          <div>
            <label htmlFor="content" className={labelClass}>
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className={fieldClass}
            />
          </div>

          <FileUploadField
            productId={product.id}
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
          productId={product.id}
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
          productId={product.id}
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
          <label htmlFor="external_url" className={labelClass}>
            External URL
          </label>
          <input
            id="external_url"
            type="url"
            value={externalUrl}
            onChange={(event) => setExternalUrl(event.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#F7B500] px-6 py-3 font-bold text-[#0B1B3D] hover:bg-[#e5a700] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
        <Link
          href="/admin/products"
          className="font-semibold text-[#0B1B3D] hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
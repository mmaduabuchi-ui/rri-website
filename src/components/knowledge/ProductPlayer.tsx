// src/components/knowledge/ProductPlayer.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  productId: string;
  mediaType: "video" | "audio" | "text" | "link";
  textContent: string | null;
  title: string;
};

type AccessPayload =
  | { mediaType: "video" | "audio"; signedUrl: string; expiresIn: number }
  | { mediaType: "link"; externalUrl: string }
  | { mediaType: "text" };

export default function ProductPlayer({
  productId,
  mediaType,
  textContent,
  title,
}: Props) {
  const [payload, setPayload] = useState<AccessPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/product-access/${productId}`, {
          cache: "no-store",
        });

        const body: unknown = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof (body as { error: unknown }).error === "string"
              ? (body as { error: string }).error
              : "Unable to load this resource.";
          if (!cancelled) setError(msg);
          return;
        }

        if (!cancelled) setPayload(body as AccessPayload);
      } catch {
        if (!cancelled) {
          setError("Unable to load this resource right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  // ---- Text: render content directly, no fetch needed ----
  if (mediaType === "text") {
    if (!textContent || !textContent.trim()) {
      return (
        <p className="rounded-xl bg-gray-50 p-6 text-sm text-gray-600">
          This resource has no text content yet.
        </p>
      );
    }
    return (
      <div className="whitespace-pre-wrap rounded-2xl border border-gray-200 bg-white p-6 text-base leading-8 text-gray-800 sm:p-8">
        {textContent}
      </div>
    );
  }

  // ---- Link: render button, no fetch needed ----
  if (mediaType === "link") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-8">
        <p className="text-sm text-gray-600">
          This resource is hosted on an external site.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E824C] px-7 py-3 font-semibold text-white transition-colors hover:bg-[#16663A]"
          onClick={(e) => {
            e.preventDefault();
            if (payload && payload.mediaType === "link") {
              window.open(payload.externalUrl, "_blank", "noopener,noreferrer");
            }
          }}
        >
          {loading ? "Preparing link..." : "Open Resource"}
        </a>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  }

  // ---- Video / Audio: fetch signed URL and stream ----
  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-100">
        <p className="text-sm text-gray-500">Loading player…</p>
      </div>
    );
  }

  if (error || !payload || payload.mediaType === "text" || payload.mediaType === "link") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
      >
        {error ?? "This resource is not available."}
      </div>
    );
  }

  if (payload.mediaType === "video") {
    return (
      <video
        controls
        controlsList="nodownload"
        preload="metadata"
        className="aspect-video w-full rounded-2xl bg-black"
        aria-label={title}
      >
        <source src={payload.signedUrl} />
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <audio
      controls
      controlsList="nodownload"
      preload="metadata"
      className="w-full"
      aria-label={title}
    >
      <source src={payload.signedUrl} />
      Your browser does not support audio playback.
    </audio>
  );
}
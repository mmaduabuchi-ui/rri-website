// src/components/admin/ArticleMediaField.tsx
"use client";

import { useRef, useState } from "react";

export type MediaType = "none" | "image" | "video" | "audio" | "link";

export type MediaValue = {
  media_type: MediaType;
  media_url: string;
  media_caption: string;
};

type Props = {
  value: MediaValue;
  onChange: (value: MediaValue) => void;
};

export default function ArticleMediaField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Maximum is 10 MB.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/articles/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Upload failed.");
        return;
      }
      onChange({ ...value, media_url: data.url });
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]";
  const labelClass = "block text-sm font-semibold text-[#0B1B3D]";

  return (
    <div className="rounded-xl border border-gray-200 bg-[#F5F7FA] p-4">
      <p className="text-sm font-semibold text-[#0B1B3D]">Article media</p>
      <p className="mt-1 text-xs text-gray-500">
        Optional. Add an image, video, audio, or external link that appears
        inside the article.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="media_type" className={labelClass}>
            Media type
          </label>
          <select
            id="media_type"
            value={value.media_type}
            onChange={(e) =>
              onChange({
                ...value,
                media_type: e.target.value as MediaType,
                media_url: "",
              })
            }
            className={inputClass}
          >
            <option value="none">None</option>
            <option value="image">Image (upload)</option>
            <option value="video">Video (URL)</option>
            <option value="audio">Audio (URL)</option>
            <option value="link">Link (URL)</option>
          </select>
        </div>

        {value.media_type === "image" && (
          <div>
            <label className={labelClass}>Image file</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
              className="mt-1.5 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#0B1B3D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#152b57]"
            />
            {uploading && (
              <p className="mt-2 text-xs text-gray-500">Uploading…</p>
            )}
            {value.media_url && (
              <p className="mt-2 text-xs break-all text-green-700">
                Uploaded: {value.media_url}
              </p>
            )}
            {error && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {error}
              </p>
            )}
          </div>
        )}

        {(value.media_type === "video" ||
          value.media_type === "audio" ||
          value.media_type === "link") && (
          <div>
            <label htmlFor="media_url" className={labelClass}>
              {value.media_type === "video"
                ? "Video URL (YouTube, Vimeo, or direct MP4)"
                : value.media_type === "audio"
                  ? "Audio URL (direct MP3 or hosted file)"
                  : "Link URL"}
            </label>
            <input
              id="media_url"
              type="url"
              value={value.media_url}
              onChange={(e) => onChange({ ...value, media_url: e.target.value })}
              placeholder={
                value.media_type === "video"
                  ? "https://www.youtube.com/watch?v=..."
                  : value.media_type === "audio"
                    ? "https://example.com/file.mp3"
                    : "https://example.com"
              }
              className={inputClass}
            />
          </div>
        )}

        {value.media_type !== "none" && (
          <div>
            <label htmlFor="media_caption" className={labelClass}>
              Caption (optional)
            </label>
            <input
              id="media_caption"
              type="text"
              value={value.media_caption}
              onChange={(e) =>
                onChange({ ...value, media_caption: e.target.value })
              }
              placeholder="A short caption shown under the media"
              className={inputClass}
            />
          </div>
        )}
      </div>
    </div>
  );
}
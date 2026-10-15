// src/components/admin/FileUploadField.tsx
"use client";

import { useRef, useState } from "react";

type Props = {
  productId: string;
  productType: "free" | "paid" | "donation";
  accept: string;
  label: string;
  hint?: string;
  currentPath?: string | null;
  onUploaded: (path: string) => void;
};

const MAX_BYTES = 50 * 1024 * 1024;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUploadField({
  productId,
  productType,
  accept,
  label,
  hint,
  currentPath,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploadedSize, setUploadedSize] = useState<number | null>(null);

  async function handleFile(file: File) {
    setError("");
    setUploadedName(null);
    setUploadedSize(null);

    if (file.size > MAX_BYTES) {
      setError(
        `File is ${formatBytes(file.size)}. Maximum is 50 MB. Compress the file or split it into parts.`,
      );
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("productId", productId);
      form.append("productType", productType);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });

      const body: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : "Upload failed.";
        setError(msg);
        return;
      }

      const path =
        typeof body === "object" &&
        body !== null &&
        "path" in body &&
        typeof (body as { path: unknown }).path === "string"
          ? (body as { path: string }).path
          : null;

      if (!path) {
        setError("Upload succeeded but no path was returned.");
        return;
      }

      setUploadedName(file.name);
      setUploadedSize(file.size);
      onUploaded(path);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0B1B3D]">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

      {currentPath && !uploadedName && (
        <p className="mt-2 rounded-lg bg-[#F5F7FA] px-3 py-2 text-xs text-gray-700">
          Current file: <span className="font-mono">{currentPath}</span>
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
          className="block w-full max-w-md cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 file:mr-3 file:rounded-md file:border-0 file:bg-[#0B1B3D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#152b57]"
        />
        {uploading && (
          <span className="text-sm text-gray-500">Uploading…</span>
        )}
      </div>

      {uploadedName && uploadedSize !== null && (
        <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-800">
          Uploaded: <span className="font-semibold">{uploadedName}</span> (
          {formatBytes(uploadedSize)})
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
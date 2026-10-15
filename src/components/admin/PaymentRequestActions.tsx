// src/components/admin/PaymentRequestActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentRequestActions({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "dismiss" | null>(null);
  const [error, setError] = useState("");

  async function act(action: "approve" | "dismiss") {
    if (
      action === "dismiss" &&
      !window.confirm("Dismiss this request without granting access?")
    ) {
      return;
    }
    setError("");
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/payment-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Action failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Action failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => act("approve")}
          disabled={busy !== null}
          className="rounded-lg bg-[#1E824C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16663A] disabled:opacity-60"
        >
          {busy === "approve" ? "Approving…" : "Approve & Grant"}
        </button>
        <button
          type="button"
          onClick={() => act("dismiss")}
          disabled={busy !== null}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
        >
          {busy === "dismiss" ? "Dismissing…" : "Dismiss"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
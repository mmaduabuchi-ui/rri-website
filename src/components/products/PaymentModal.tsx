// src/components/products/PaymentModal.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Props = {
  productId: string;
  productTitle: string;
  onClose: () => void;
};

type PaymentInfo = {
  bank: string;
  account: string;
  name: string;
  whatsapp: string;
};

export default function PaymentModal({
  productId,
  productTitle,
  onClose,
}: Props) {
  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoError, setInfoError] = useState("");

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Load bank details
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/payment-info", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          if (!cancelled)
            setInfoError(
              data?.error ?? "Unable to load payment information.",
            );
          return;
        }
        if (!cancelled) setInfo(data as PaymentInfo);
      } catch {
        if (!cancelled) setInfoError("Unable to load payment information.");
      } finally {
        if (!cancelled) setLoadingInfo(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, note }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(
          data?.error ?? "Unable to submit your payment request.",
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Unable to submit your payment request.");
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappHref = info?.whatsapp
    ? `https://wa.me/${info.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        `Hello RRI, I have paid for "${productTitle}".`,
      )}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="payment-modal-title"
            className="text-xl font-bold text-[#0B1B3D] sm:text-2xl"
          >
            How to unlock this resource
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Pay for <span className="font-semibold">{productTitle}</span> using
          the details below, then submit this form so an admin can confirm your
          payment.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold text-green-800">
              Payment request received
            </h3>
            <p className="mt-2 text-sm text-green-700">
              An admin will review your request shortly. You will be able to
              access this resource once your payment is confirmed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg bg-[#1E824C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16663A]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-gray-200 bg-[#F5F7FA] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1E824C]">
                Bank Details
              </p>

              {loadingInfo ? (
                <p className="mt-3 text-sm text-gray-500">
                  Loading bank details…
                </p>
              ) : infoError ? (
                <p role="alert" className="mt-3 text-sm text-red-700">
                  {infoError}
                </p>
              ) : (
                <dl className="mt-3 space-y-1 text-sm text-gray-800">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Bank</dt>
                    <dd className="font-semibold text-right">
                      {info?.bank || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Account</dt>
                    <dd className="font-mono font-semibold text-right">
                      {info?.account || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Name</dt>
                    <dd className="font-semibold text-right">
                      {info?.name || "—"}
                    </dd>
                  </div>
                </dl>
              )}

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#1E824C] hover:underline"
                >
                  Send payment proof on WhatsApp →
                </a>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="payment-note"
                  className="block text-sm font-semibold text-[#0B1B3D]"
                >
                  Note (optional)
                </label>
                <textarea
                  id="payment-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reference, date paid, or any note for the admin…"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]"
                />
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submitError}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#F7B500] px-6 py-2.5 font-bold text-[#0B1B3D] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "I have paid"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
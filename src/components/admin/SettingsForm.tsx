// src/components/admin/SettingsForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type SettingsValues = {
  admin_email: string;
  admin_whatsapp: string;
  payment_bank: string;
  payment_account: string;
  payment_name: string;
};

const fields: Array<{
  key: keyof SettingsValues;
  label: string;
  hint?: string;
  type?: string;
}> = [
  {
    key: "admin_email",
    label: "Admin contact email",
    hint: "Shown to members when they need to reach the admin.",
    type: "email",
  },
  {
    key: "admin_whatsapp",
    label: "Admin WhatsApp number",
    hint: "Include the country code, e.g. +234...",
  },
  {
    key: "payment_bank",
    label: "Bank name",
    hint: "Displayed in the payment modal for paid products.",
  },
  {
    key: "payment_account",
    label: "Account number",
  },
  {
    key: "payment_name",
    label: "Account name",
  },
];

export default function SettingsForm({
  initial,
}: {
  initial: SettingsValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsValues>(initial);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(key: keyof SettingsValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to save settings.";
        setErrorMessage(message);
        return;
      }

      setSuccessMessage("Settings saved.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save settings.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]";
  const labelClass = "block text-sm font-semibold text-[#0B1B3D]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 border-t-4 border-t-[#1E824C] bg-white p-6 shadow-sm sm:p-8"
    >
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className={labelClass}>
            {field.label}
          </label>
          <input
            id={field.key}
            type={field.type ?? "text"}
            value={values[field.key]}
            onChange={(e) => update(field.key, e.target.value)}
            className={inputClass}
          />
          {field.hint && (
            <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
          )}
        </div>
      ))}

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 font-bold text-[#0B1B3D] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

// Web3Forms endpoint — this key routes submissions to your inbox.
// Dashboard: https://web3forms.com/
const WEB3FORMS_ACCESS_KEY = "2c8ea82e-c1c1-4993-be74-91373961ee67";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const honeypot = String(formData.get("botcheck") || "").trim();

    // Spam bots tend to fill every field, including hidden ones. If this
    // one has a value, silently pretend to succeed without sending anything.
    if (honeypot.length > 0) {
      setStatus("success");
      form.reset();
      return;
    }

    // Simple client-side validation
    if (fullName.length < 2) {
      setStatus("error");
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      setStatus("error");
      setError("Please enter a message of at least 10 characters.");
      return;
    }

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: fullName,
          email,
          message,
          subject: `New contact form message from ${fullName}`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Web3Forms request failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        "Something went wrong sending your message. Please try again, or email us directly."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field — hidden from real users, catches spam bots */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />

      {/* Full Name */}
      <div>
        <label
          htmlFor="full-name"
          className="block text-sm font-semibold text-[#0B1B3D]"
        >
          Full Name
        </label>

        <input
          id="full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          disabled={status === "submitting"}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1E824C] focus:ring-2 focus:ring-[#1E824C]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Your full name"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#0B1B3D]"
        >
          Email Address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={status === "submitting"}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1E824C] focus:ring-2 focus:ring-[#1E824C]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="you@example.com"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-[#0B1B3D]"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          required
          maxLength={3000}
          rows={7}
          disabled={status === "submitting"}
          className="mt-2 block w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1E824C] focus:ring-2 focus:ring-[#1E824C]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="How can we help?"
        />
      </div>

      {/* Success message */}
      {status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
        >
          Your message has been received. Thank you for contacting RRI.
        </div>
      )}

      {/* Error message */}
      {status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200] focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-xs leading-5 text-gray-500">
        Please do not submit sensitive personal information through this form.
      </p>
    </form>
  );
}
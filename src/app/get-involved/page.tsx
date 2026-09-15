"use client";

import { useState } from "react";
import Link from "next/link";

const ACCESS_KEY = "rri_knowledge_access";

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    skills: "",
    areaOfInterest: "Human Development & Education",
    whyJoin: "",
    availability: "1–3 hours / week",
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a local reference number. No backend yet.
    const generatedId = `RRI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedId);

    // Unlock Knowledge Centre access on this device.
    try {
      localStorage.setItem(ACCESS_KEY, "true");
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fail silently
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto my-12 max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl text-[#F7B500]">
          ✓
        </div>
        <h2 className="mt-4 text-3xl font-bold text-[#0B1B3D]">
          Welcome, Realisean.
        </h2>
        <p className="mt-2 text-gray-600">
          Thank you for your interest in joining Realise Reality Initiative.
          Please keep your reference number for your records.
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <span className="text-xs font-bold uppercase text-gray-400">
            Your Reference Number
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-[#0B1B3D]">
            {referenceId}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-5">
          <p className="text-sm font-semibold text-green-800">
            🎉 Knowledge Centre unlocked
          </p>
          <p className="mt-1 text-xs leading-5 text-green-700">
            You now have access to our library of books, guides, workbooks, and
            daily articles on this device.
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/knowledge-centre"
            className="inline-flex items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 text-sm font-bold text-[#0B1B3D] transition hover:bg-[#dca200]"
          >
            Enter Knowledge Centre
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#1E824C] px-6 py-3 text-sm font-semibold text-[#1E824C] transition hover:bg-[#1E824C] hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-12 max-w-2xl space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#0B1B3D]">
        Join the Realisean Ecosystem
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            required
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            required
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location / City
        </label>
        <input
          required
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Skills &amp; Expertise
        </label>
        <input
          name="skills"
          placeholder="e.g. Community Organizing, Teaching, Research, Design"
          type="text"
          value={formData.skills}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Areas of Interest
        </label>
        <select
          name="areaOfInterest"
          value={formData.areaOfInterest}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
        >
          <option>Human Development &amp; Education</option>
          <option>Humanitarian &amp; Community Welfare</option>
          <option>Research &amp; Content Creation</option>
          <option>Event Coordination</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Why do you want to join RRI?
        </label>
        <textarea
          required
          name="whyJoin"
          rows={3}
          value={formData.whyJoin}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Volunteer Availability
        </label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#0B1B3D] focus:outline-none"
        >
          <option>1–3 hours / week</option>
          <option>4–8 hours / week</option>
          <option>Event-based availability</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#0B1B3D] py-3 text-sm font-bold text-white transition hover:bg-[#122856]"
      >
        Submit Membership Interest
      </button>

      <p className="text-center text-xs leading-5 text-gray-500">
        By submitting, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[#0B1B3D]">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline hover:text-[#0B1B3D]">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
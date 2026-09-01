"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    location: "",
    skills: "",
    areaOfInterest: "Human Development & Education",
    whyJoin: "",
    availability: "1–3 hours / week",
  });

  const [submitted, setSubmitted] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Generate unique Member ID: RRI-2026-XXXX
      const generatedId = `RRI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Register account via Supabase Auth & pass all metadata to user_metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            country: formData.country,
            location: formData.location,
            skills: formData.skills,
            area_of_interest: formData.areaOfInterest,
            why_join: formData.whyJoin,
            availability: formData.availability,
            member_id: generatedId,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        setMemberId(generatedId);
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg my-12 border border-gray-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl text-[#F7B500]">
          ✓
        </div>
        <h2 className="mt-4 text-3xl font-bold text-[#0B1B3D]">Welcome, Realisean.</h2>
        <p className="mt-2 text-gray-600">
          Your registration as a member of Realise Reality Initiative is complete.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-6 border border-gray-200">
          <span className="text-xs uppercase font-bold text-gray-400">Your Official Member ID</span>
          <div className="text-2xl font-mono font-bold text-[#0B1B3D] mt-1">{memberId}</div>
        </div>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 text-sm font-bold text-[#0B1B3D] hover:bg-[#dca200] transition"
        >
          Access Member Dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-12">
      <h2 className="text-2xl font-bold text-[#0B1B3D]">Join the Realisean Ecosystem</h2>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            required
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            required
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            required
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location / City</label>
          <input
            required
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skills & Expertise</label>
        <input
          name="skills"
          placeholder="e.g. Community Organizing, Teaching, Research, Design"
          type="text"
          value={formData.skills}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Areas of Interest</label>
        <select
          name="areaOfInterest"
          value={formData.areaOfInterest}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
        >
          <option>Human Development & Education</option>
          <option>Humanitarian & Community Welfare</option>
          <option>Research & Content Creation</option>
          <option>Event Coordination</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Why do you want to join RRI?</label>
        <textarea
          required
          name="whyJoin"
          rows={3}
          value={formData.whyJoin}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Volunteer Availability</label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#0B1B3D]"
        >
          <option>1–3 hours / week</option>
          <option>4–8 hours / week</option>
          <option>Event-based availability</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#0B1B3D] py-3 text-sm font-bold text-white hover:bg-[#122856] transition disabled:opacity-50"
      >
        {loading ? "Registering Account..." : "Submit & Claim Member ID"}
      </button>
    </form>
  );
}
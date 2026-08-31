"use client";

import { useState } from "react";

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [memberId, setMemberId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate temporary ID format: RRI-2026-XXXX
    const generatedId = `RRI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setMemberId(generatedId);
    setSubmitted(true);
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

        <button className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 text-sm font-bold text-[#0B1B3D] hover:bg-[#dca200]">
          Access Member Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-12">
      <h2 className="text-2xl font-bold text-[#0B1B3D]">Join the Realisean Ecosystem</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input required type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input required type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location / City</label>
        <input required type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skills & Expertise</label>
        <input placeholder="e.g. Community Organizing, Teaching, Research, Design" type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Areas of Interest</label>
        <select className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm">
          <option>Human Development & Education</option>
          <option>Humanitarian & Community Welfare</option>
          <option>Research & Content Creation</option>
          <option>Event Coordination</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Why do you want to join RRI?</label>
        <textarea rows={3} required className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Volunteer Availability</label>
        <select className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm">
          <option>1–3 hours / week</option>
          <option>4–8 hours / week</option>
          <option>Event-based availability</option>
        </select>
      </div>

      <button type="submit" className="w-full rounded-lg bg-[#0B1B3D] py-3 text-sm font-bold text-white hover:bg-[#122856]">
        Submit & Claim Member ID
      </button>
    </form>
  );
}
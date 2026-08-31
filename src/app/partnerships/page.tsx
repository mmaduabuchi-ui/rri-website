"use client";

import { useState } from "react";

const partnerTypes = [
  "NGO / Non-Profit",
  "Educational Institution",
  "Corporate / Business",
  "Research Organization",
  "Community Group",
  "International Sponsor",
];

export default function PartnershipsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Partner With RRI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Collaborating with global institutions, civil society, and businesses to advance truth, education, and human development.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          
          {/* Target Tracks Info */}
          <div className="space-y-6 lg:col-span-5">
            <h2 className="text-2xl font-bold text-[#0B1B3D]">Who We Work With</h2>
            <div className="space-y-4">
              {partnerTypes.map((type) => (
                <div key={type} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-gray-800">
                  <div className="h-2 w-2 rounded-full bg-[#F7B500]"></div>
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center">
                  <h3 className="text-2xl font-bold text-[#0B1B3D]">Partnership Request Received</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Thank you for reaching out. Our partnerships team will review your proposal and get in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                  <h3 className="text-xl font-bold text-[#0B1B3D]">Partner With Us Form</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input required type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <input required type="text" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Official Email</label>
                      <input required type="email" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Partnership Category</label>
                    <select className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm">
                      {partnerTypes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scope of Collaboration</label>
                    <textarea rows={4} required placeholder="Describe how your organization would like to collaborate with RRI..." className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"></textarea>
                  </div>

                  <button type="submit" className="w-full rounded-lg bg-[#0B1B3D] py-3 text-sm font-bold text-white hover:bg-[#122856]">
                    Submit Partnership Proposal
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Route based on role from members table
    const { data: member } = await supabase
      .from("members")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (member?.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1B3D]">Member & Admin Login</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to access your Realise Reality portal.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-[#0B1B3D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-[#0B1B3D] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0B1B3D] px-4 py-2.5 font-bold text-white transition hover:bg-[#122856] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
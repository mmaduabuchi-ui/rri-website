"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface MemberProfile {
  id: string;
  full_name?: string;
  member_id?: string;
  email?: string;
  country?: string;
  phone?: string;
  role?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      // Fetch profile from 'members' table
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (isMounted) {
        if (!error && data) {
          setProfile(data);
        } else {
          // Fallback to auth metadata if members row is missing
          setProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "Realisean",
            member_id: "PENDING",
            role: "Member",
          });
        }
        setLoading(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="font-medium text-gray-500">Loading your portal...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0B1B3D]">
              Realisean Member Portal
            </span>
            <h1 className="mt-2 text-2xl font-bold text-[#0B1B3D]">
              Welcome, {profile?.full_name || "Realisean"}!
            </h1>
            <p className="font-mono text-sm text-gray-500">
              Official ID: {profile?.member_id || "N/A"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">
              Email Address
            </p>
            <p className="mt-1 text-base font-medium text-gray-800">
              {profile?.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">
              Country
            </p>
            <p className="mt-1 text-base font-medium text-gray-800">
              {profile?.country || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">
              Phone Number
            </p>
            <p className="mt-1 text-base font-medium text-gray-800">
              {profile?.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400">
              Membership Role
            </p>
            <p className="mt-1 text-base font-medium capitalize text-gray-800">
              {profile?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
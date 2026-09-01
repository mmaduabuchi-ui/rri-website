"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function initAdminPanel() {
      // 1. Verify user authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      // 2. Verify admin role
      const { data: profile, error: profileErr } = await supabase
        .from("members")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileErr || profile?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      // 3. Fetch member data
      const { data, error: fetchErr } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    }

    initAdminPanel();
  }, [router]);

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.member_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3D] bg-blue-50 px-2.5 py-1 rounded-full">
              Admin Control Panel
            </span>
            <h1 className="text-2xl font-bold text-[#0B1B3D] mt-2">Registered RRI Members</h1>
            <p className="text-sm text-gray-500">Total Registered: {members.length}</p>
          </div>

          <input
            type="text"
            placeholder="Search name, email, country, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-[#0B1B3D] w-full md:w-80"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Members Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Member ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email / Phone</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No registered members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-mono font-bold text-[#0B1B3D]">
                        {member.member_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {member.full_name}
                      </td>
                      <td className="px-6 py-4">
                        <div>{member.email}</div>
                        <div className="text-xs text-gray-400">{member.phone || "No phone"}</div>
                      </td>
                      <td className="px-6 py-4">{member.country || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            member.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {member.role || "Member"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
// src/components/admin/AccessManager.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MemberOption = {
  id: string;
  email: string | null;
  name: string | null;
};

type ProductOption = {
  id: string;
  title: string;
  type: string;
};

type GrantRow = {
  id: string;
  user_id: string;
  product_id: string;
  member_email: string | null;
  member_name: string | null;
  product_title: string;
  created_at: string;
};

export default function AccessManager({
  members,
  products,
  grants,
}: {
  members: MemberOption[];
  products: ProductOption[];
  grants: GrantRow[];
}) {
  const router = useRouter();
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members.slice(0, 10);
    return members
      .filter(
        (m) =>
          (m.email ?? "").toLowerCase().includes(q) ||
          (m.name ?? "").toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [memberQuery, members]);

  async function grant() {
    setError("");
    setSuccess("");
    if (!selectedMemberId) return setError("Pick a member.");
    if (!selectedProductId) return setError("Pick a product.");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedMemberId,
          productId: selectedProductId,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to grant access.");
        return;
      }
      setSuccess("Access granted.");
      setSelectedMemberId("");
      setSelectedProductId("");
      setMemberQuery("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function revoke(userId: string, productId: string) {
    if (!window.confirm("Revoke this member's access to this product?")) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to revoke access.");
        return;
      }
      setSuccess("Access revoked.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500]";
  const labelClass = "block text-sm font-semibold text-[#0B1B3D]";

  return (
    <div className="space-y-10">
      {/* Grant form */}
      <section className="rounded-2xl border border-gray-200 border-t-4 border-t-[#1E824C] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-[#0B1B3D]">
          Grant new access
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <label className={labelClass} htmlFor="member-search">
              Find member by email or name
            </label>
            <input
              id="member-search"
              type="text"
              value={memberQuery}
              onChange={(e) => {
                setMemberQuery(e.target.value);
                setSelectedMemberId("");
              }}
              placeholder="start typing…"
              className={inputClass}
            />
            {memberQuery && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                {filteredMembers.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">No matches.</p>
                ) : (
                  filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setMemberQuery(m.email ?? m.name ?? "");
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                        selectedMemberId === m.id ? "bg-[#F5F7FA]" : ""
                      }`}
                    >
                      <span className="font-semibold text-[#0B1B3D]">
                        {m.name ?? "Unnamed"}
                      </span>{" "}
                      <span className="text-gray-500">
                        ({m.email ?? "no email"})
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="product-select">
              Product
            </label>
            <select
              id="product-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className={inputClass}
            >
              <option value="">— select a product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.type}] {p.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              {success}
            </p>
          )}

          <button
            type="button"
            onClick={grant}
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-6 py-3 font-bold text-[#0B1B3D] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Working…" : "Grant access"}
          </button>
        </div>
      </section>

      {/* Existing grants */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-[#0B1B3D]">
          Existing grants ({grants.length})
        </h2>

        {grants.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No access has been granted yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-160 divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Member
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Granted
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grants.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#0B1B3D]">
                        {g.member_name ?? "Unnamed"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {g.member_email ?? "no email"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{g.product_title}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(g.created_at))}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => revoke(g.user_id, g.product_id)}
                        disabled={busy}
                        className="font-semibold text-red-700 hover:underline disabled:opacity-60"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
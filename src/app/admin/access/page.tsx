// src/app/admin/access/page.tsx
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import AccessManager from "@/components/admin/AccessManager";
import PaymentRequestActions from "@/components/admin/PaymentRequestActions";

export default async function AdminAccessPage() {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    throw new Error(`Unable to verify your session: ${authError.message}`);
  }
  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Unable to verify administrator access: ${profileError.message}`,
    );
  }
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const [membersRes, productsRes, grantsRes, requestsRes] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, name")
      .order("email", { ascending: true }),
    admin
      .from("products")
      .select("id, title, type")
      .order("created_at", { ascending: false }),
    admin
      .from("product_access")
      .select("id, user_id, product_id, granted_at")
      .order("granted_at", { ascending: false }),
    admin
      .from("payment_requests")
      .select("id, user_id, product_id, note, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  if (grantsRes.error) {
    throw new Error(
      `Unable to load access grants: ${grantsRes.error.message}`,
    );
  }
  if (requestsRes.error) {
    throw new Error(
      `Unable to load payment requests: ${requestsRes.error.message}`,
    );
  }

  const members = membersRes.data ?? [];
  const products = productsRes.data ?? [];
  const rawGrants = grantsRes.data ?? [];
  const rawRequests = requestsRes.data ?? [];

  const memberMap = new Map(members.map((m) => [m.id, m]));
  const productMap = new Map(products.map((p) => [p.id, p]));

  const grants = rawGrants.map((g) => {
    const member = memberMap.get(g.user_id);
    const product = productMap.get(g.product_id);
    return {
      id: g.id,
      user_id: g.user_id,
      product_id: g.product_id,
      created_at: g.granted_at,
      member_email: member?.email ?? null,
      member_name: member?.name ?? null,
      product_title: product?.title ?? "(deleted product)",
    };
  });

  const pendingRequests = rawRequests.map((r) => {
    const member = memberMap.get(r.user_id);
    const product = productMap.get(r.product_id);
    return {
      id: r.id,
      user_id: r.user_id,
      product_id: r.product_id,
      note: r.note,
      created_at: r.created_at,
      member_email: member?.email ?? null,
      member_name: member?.name ?? null,
      product_title: product?.title ?? "(deleted product)",
    };
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Access Management
          </h1>
          <p className="mt-3 text-gray-600">
            Approve payment requests or grant access to products manually.
          </p>
        </header>

        {/* Pending payment requests */}
        <section className="mb-10 rounded-2xl border border-gray-200 border-t-4 border-t-[#F7B500] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-[#0B1B3D]">
            Pending payment requests ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No pending payment requests.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {pendingRequests.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B1B3D]">
                        {r.member_name ?? "Unnamed"}{" "}
                        <span className="font-normal text-gray-500">
                          ({r.member_email ?? "no email"})
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        Wants:{" "}
                        <span className="font-semibold">{r.product_title}</span>
                      </p>
                      {r.note && (
                        <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
                          &ldquo;{r.note}&rdquo;
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(r.created_at))}
                      </p>
                    </div>

                    <PaymentRequestActions requestId={r.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Manual grant + existing grants */}
        <AccessManager
          members={members}
          products={products}
          grants={grants}
        />
      </div>
    </main>
  );
}
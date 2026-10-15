// src/app/admin/access/page.tsx
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import AccessManager from "@/components/admin/AccessManager";

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

  const [membersRes, productsRes, grantsRes] = await Promise.all([
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
  ]);

  if (grantsRes.error) {
    throw new Error(
      `Unable to load access grants: ${grantsRes.error.message}`,
    );
  }

  const members = membersRes.data ?? [];
  const products = productsRes.data ?? [];
  const rawGrants = grantsRes.data ?? [];

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Access Management
          </h1>
          <p className="mt-3 text-gray-600">
            Grant or revoke member access to products.
          </p>
        </header>

        <AccessManager
          members={members}
          products={products}
          grants={grants}
        />
      </div>
    </main>
  );
}
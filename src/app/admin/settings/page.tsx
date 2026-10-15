
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-semibold text-[#0B1B3D]">
        Settings
      </h1>

      <p className="mt-2 text-gray-600">
        Manage administrative settings for Realise Realty.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#0B1B3D]">
          Account
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Administrator email</p>
            <p className="font-medium">{user.email ?? "Not available"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Access role</p>
            <p className="font-medium">{profile.role}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
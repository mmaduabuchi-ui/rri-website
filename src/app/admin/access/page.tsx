
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAccessPage() {
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

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, role, membership_status");

  const admins =
    profiles?.filter((item) => item.role === "admin").length ?? 0;
  const members =
    profiles?.filter((item) => item.role === "member").length ?? 0;
  const pending =
    profiles?.filter((item) => item.membership_status === "pending").length ??
    0;

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0B1B3D]">
          Access Management
        </h1>
        <p className="mt-2 text-gray-600">
          Review administrator roles and member access status.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600">
          Could not load access information: {error.message}
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="mt-2 text-3xl font-semibold">
                {profiles?.length ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="mt-2 text-3xl font-semibold">{admins}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Pending Members</p>
              <p className="mt-2 text-3xl font-semibold">{pending}</p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">
              Account Access
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {members} member accounts currently have the member role.
            </p>

            <Link
              href="/admin/members"
              className="mt-5 inline-flex rounded-md bg-[#0B1B3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#152b55]"
            >
              Manage Members
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
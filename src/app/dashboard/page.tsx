import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E824C]">
            Realise Reality Initiative
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
            Welcome to your dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your account and access your available resources.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 border-t-4 border-t-[#1E824C] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-[#0B1B3D]">
            Account overview
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email address</p>
              <p className="mt-1 break-all font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account role</p>
              <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-800">
                {isAdmin ? "Administrator" : "Member"}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          {isAdmin && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0B1B3D]">
                Administration
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Access administrative tools for managing the initiative.
              </p>

              <Link
                href="/admin"
                className="mt-5 inline-flex rounded-lg bg-[#1E824C] px-5 py-3 font-medium text-white transition hover:bg-green-800"
              >
                Open admin area
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">
              Public website
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Return to the main website to explore the initiative.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg border border-gray-300 px-5 py-3 font-medium text-[#0B1B3D] transition hover:bg-gray-50"
            >
              Visit homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
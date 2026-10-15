import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E824C]">
            Realise Reality Initiative
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
            Administration
          </h1>

          <p className="mt-3 text-gray-600">
            Manage the initiative’s website and administrative activities.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 border-t-4 border-t-[#1E824C] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-[#0B1B3D]">
            Administrator account
          </h2>

          <p className="mt-3 break-all text-gray-700">
            Signed in as: {user.email}
          </p>

          <span className="mt-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Administrator access verified
          </span>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">Content</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Create and update articles and website content.
            </p>
            <Link href="/admin/articles" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">Products</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage the products available through the initiative.
            </p>
            <Link href="/admin/products" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">Members</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              View and manage registered initiative members.
            </p>
            <Link href="/admin/members" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">
              Applications
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review and manage membership applications.
            </p>
            <Link href="/admin/applications" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">Access</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review and manage administrative access.
            </p>
            <Link href="/admin/access" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">Settings</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Configure administrative and website preferences.
            </p>
            <Link href="/admin/settings" className="mt-4 inline-flex font-medium text-[#1E824C] hover:underline">
              Manage →
            </Link>
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg bg-[#0B1B3D] px-5 py-3 font-medium text-white transition hover:bg-blue-950"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
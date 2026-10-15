import Link from "next/link";
import { redirect } from "next/navigation";
import { requireApprovedMember } from "@/lib/auth/approved-member";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { user, isAdmin } = await requireApprovedMember();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, membership_status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/login");

  const links = [
    {
      title: "Member Chat",
      description: "Talk with other members of the RRI community.",
      href: "/dashboard/chat",
    },
    {
      title: "Knowledge Centre",
      description: "Explore articles, books, publications, and resources.",
      href: "/knowledge-centre",
    },
    {
      title: "Humanity & Welfare",
      description: "Explore the initiative's welfare programmes.",
      href: "/welfare",
    },
    {
      title: "Global Presence",
      description: "Learn about the initiative's global structure.",
      href: "/global-presence",
    },
    {
      title: "Contact",
      description: "Contact the initiative for support or enquiries.",
      href: "/contact",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1E824C]">
            Realise Reality Initiative
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
            Welcome{profile.name ? `, ${profile.name}` : ""}
          </h1>

          <p className="mt-3 text-gray-600">
            Your account and resources in one place.
          </p>
        </header>

        <section className="bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#0B1B3D]">
            Account overview
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Email address</p>
              <p className="mt-1 break-all font-medium text-gray-900">
                {user.email ?? "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account role</p>
              <p className="mt-1 font-medium capitalize text-gray-900">
                {isAdmin ? "Administrator" : "Member"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Membership status</p>
              <p className="mt-1 font-medium capitalize text-green-700">
                {profile.membership_status ?? "Approved"}
              </p>
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="mt-8 bg-white p-6">
            <h2 className="text-lg font-semibold text-[#0B1B3D]">
              Administration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage members, products, articles, and website administration.
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-flex bg-[#1E824C] px-5 py-3 font-medium text-white hover:bg-green-800"
            >
              Open admin area
            </Link>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-5 text-xl font-semibold text-[#0B1B3D]">
            Explore RRI
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white p-6 transition hover:bg-gray-100"
              >
                <h3 className="font-semibold text-[#0B1B3D]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-[#1E824C]">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#0B1B3D] hover:underline"
          >
            ← Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
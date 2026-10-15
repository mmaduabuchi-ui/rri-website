import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MembershipPendingPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Unable to verify your session: ${authError.message}`);
  }

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, membership_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to verify membership: ${profileError.message}`);
  }

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  if (profile?.membership_status === "approved") {
    redirect("/dashboard");
  }

  const isRejected = profile?.membership_status === "rejected";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#1E824C]">
          Realise Reality Initiative
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0B1B3D]">
          {isRejected ? "Membership not approved" : "Membership approval pending"}
        </h1>
        <p className="mt-4 leading-7 text-gray-600">
          {isRejected
            ? "Your account does not currently have approved membership. Please contact the RRI team if you believe this decision should be reviewed."
            : "Your account can access member features after an administrator approves its membership."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0B1B3D] px-5 py-3 font-semibold text-white hover:bg-[#152b57]"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-3 font-semibold text-[#0B1B3D] hover:bg-gray-50"
          >
            Contact RRI
          </Link>
        </div>
      </section>
    </main>
  );
}

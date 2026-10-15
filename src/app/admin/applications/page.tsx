import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import ApplicationsList, {
  type MembershipApplication,
} from "./ApplicationsList";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to verify administrator access: ${profileError.message}`);
  }

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data, error } = await createAdminClient()
    .from("membership_applications")
    .select(
      "id, name, email, phone, country, city, area_of_interest, skills, reason_for_joining, availability, reference_number, submitted_at, application_status, approved_profile_id",
    )
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load membership applications: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1B3D]">
              Membership Applications
            </h1>
            <p className="mt-2 text-gray-600">
              Review submissions and update their application status.
            </p>
          </div>
          <Link
            href="/admin"
            className="font-semibold text-[#1E824C] hover:underline"
          >
            Back to admin
          </Link>
        </div>

        <ApplicationsList
          initialApplications={(data ?? []) as MembershipApplication[]}
        />
      </div>
    </main>
  );
}

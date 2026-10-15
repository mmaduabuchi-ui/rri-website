import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || currentProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const [
    { data: usersData, error: usersError },
    { data: profilesData, error: profilesError },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 100 }),
    admin
      .from("profiles")
      .select("id, role, country, city"),
  ]);

  if (usersError) {
    throw new Error(`Unable to load members: ${usersError.message}`);
  }

  if (profilesError) {
    throw new Error(`Unable to load member profiles: ${profilesError.message}`);
  }

  const profiles = new Map(
    (profilesData ?? []).map((profile) => [profile.id, profile]),
  );

  const members = usersData.users.map((member) => ({
    id: member.id,
    email: member.email ?? "No email",
    name:
      typeof member.user_metadata?.name === "string"
        ? member.user_metadata.name
        : "Unnamed member",
    createdAt: member.created_at,
    profile: profiles.get(member.id),
  }));

  async function deleteMember(formData: FormData) {
    "use server";

    const memberId = formData.get("memberId");

    if (typeof memberId !== "string" || !memberId) {
      throw new Error("A valid member ID is required.");
    }

    const authClient = await createClient();
    const {
      data: { user: currentUser },
    } = await authClient.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const { data: adminProfile } = await authClient
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (adminProfile?.role !== "admin") {
      redirect("/dashboard");
    }

    if (memberId === currentUser.id) {
      throw new Error("You cannot delete your own administrator account.");
    }

    const adminClient = createAdminClient();

    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", memberId)
      .maybeSingle();

    if (targetProfile?.role === "admin") {
      throw new Error("Administrator accounts cannot be deleted here.");
    }

    const { error } = await adminClient.auth.admin.deleteUser(memberId);

    if (error) {
      throw new Error(`Unable to delete member: ${error.message}`);
    }

    revalidatePath("/admin/members");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1B3D]">
              Members Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Manage registered members and their access.
            </p>
          </div>

          <Link
            href="/admin/members/new"
            className="rounded-lg bg-[#F7B500] px-5 py-3 font-bold text-[#0B1B3D] hover:bg-[#dca200]"
          >
            + Add Member
          </Link>
        </div>

        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total registered accounts</p>
          <p className="mt-1 text-3xl font-bold text-[#0B1B3D]">
            {usersData.users.length}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-[#0B1B3D] text-white">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {member.name}
                    </p>
                    <p className="mt-1 text-gray-500">{member.email}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.profile?.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.profile?.role ?? "member"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {[member.profile?.city, member.profile?.country]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    {member.id === user.id ||
                    member.profile?.role === "admin" ? (
                      <span className="text-gray-400">Protected</span>
                    ) : (
                      <form action={deleteMember}>
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />
                        <button
                          type="submit"
                          className="font-semibold text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing up to 100 registered accounts. Administrator accounts are
          protected from deletion on this page.
        </p>
      </div>
    </main>
  );
}
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

  if (authError || !user) redirect("/login");

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();

  const [
    { data: usersData, error: usersError },
    { data: profilesData, error: profilesError },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 100 }),
    admin
      .from("profiles")
      .select(
        "id, name, email, role, country, city, membership_status, created_at",
      ),
  ]);

  if (usersError) {
    throw new Error(`Unable to load members: ${usersError.message}`);
  }

  if (profilesError) {
    throw new Error(`Unable to load profiles: ${profilesError.message}`);
  }

  const profiles = new Map(
    (profilesData ?? []).map((profile) => [profile.id, profile]),
  );

  const members = usersData.users.map((member) => {
    const profile = profiles.get(member.id);

    return {
      id: member.id,
      email: member.email ?? profile?.email ?? "No email",
      name: profile?.name ?? member.user_metadata?.name ?? "Unnamed member",
      role: profile?.role ?? "member",
      status: profile?.membership_status ?? "pending",
      country: profile?.country,
      city: profile?.city,
      createdAt: member.created_at,
    };
  });

  async function updateMembership(formData: FormData) {
    "use server";

    const memberId = formData.get("memberId");
    const action = formData.get("action");

    if (
      typeof memberId !== "string" ||
      !memberId ||
      (action !== "approve" && action !== "reject")
    ) {
      throw new Error("Invalid membership action.");
    }

    const auth = await createClient();
    const {
      data: { user: currentUser },
    } = await auth.auth.getUser();

    if (!currentUser) redirect("/login");

    const { data: profile } = await auth
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (profile?.role !== "admin") redirect("/dashboard");

    const adminClient = createAdminClient();

    const { data: target, error: targetError } = await adminClient
      .from("profiles")
      .select("id, role")
      .eq("id", memberId)
      .maybeSingle();

    if (targetError || !target) {
      throw new Error("Member profile not found.");
    }

    if (target.role === "admin") {
      throw new Error("Administrator membership cannot be changed here.");
    }

    const { error } = await adminClient
      .from("profiles")
      .update({
        membership_status: action === "approve" ? "approved" : "rejected",
      })
      .eq("id", memberId);

    if (error) {
      throw new Error(`Unable to update membership: ${error.message}`);
    }

    revalidatePath("/admin/members");
    revalidatePath("/dashboard");
  }

  async function deleteMember(formData: FormData) {
    "use server";

    const memberId = formData.get("memberId");

    if (typeof memberId !== "string" || !memberId) {
      throw new Error("Invalid member ID.");
    }

    const auth = await createClient();
    const {
      data: { user: currentUser },
    } = await auth.auth.getUser();

    if (!currentUser) redirect("/login");

    const { data: profile } = await auth
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (profile?.role !== "admin") redirect("/dashboard");

    if (memberId === currentUser.id) {
      throw new Error("You cannot delete your own account.");
    }

    const adminClient = createAdminClient();

    const { data: target, error: targetError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", memberId)
      .maybeSingle();

    if (targetError || !target) {
      throw new Error("Member profile not found.");
    }

    if (target.role === "admin") {
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
              Review and manage membership applications.
            </p>
          </div>

          <Link
            href="/admin/members/new"
            className="rounded-lg bg-[#F7B500] px-5 py-3 font-bold text-[#0B1B3D]"
          >
            + Add Member
          </Link>
        </div>

        <div className="mb-5 rounded-xl bg-white p-5">
          <p className="text-sm text-gray-500">Registered accounts</p>
          <p className="mt-1 text-3xl font-bold text-[#0B1B3D]">
            {members.length}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Pending approval: {members.filter((m) => m.status === "pending").length}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white">
          <table className="w-full min-w-262.5 text-left text-sm">
            <thead className="bg-[#0B1B3D] text-white">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="mt-1 text-gray-500">{member.email}</p>
                  </td>

                  <td className="px-5 py-4">{member.role}</td>

                  <td className="px-5 py-4 text-gray-600">
                    {[member.city, member.country].filter(Boolean).join(", ") ||
                      "Not provided"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : member.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/members/${member.id}/edit`}
                        className="font-semibold text-blue-700 hover:text-blue-900"
                      >
                        Edit
                      </Link>

                      {member.role !== "admin" &&
                        member.status !== "approved" && (
                          <form action={updateMembership}>
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="approve"
                            />
                            <button
                              type="submit"
                              className="font-semibold text-green-700 hover:text-green-900"
                            >
                              Approve
                            </button>
                          </form>
                        )}

                      {member.role !== "admin" &&
                        member.status !== "rejected" && (
                          <form action={updateMembership}>
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="reject"
                            />
                            <button
                              type="submit"
                              className="font-semibold text-orange-700 hover:text-orange-900"
                            >
                              Reject
                            </button>
                          </form>
                        )}

                      {member.id !== user.id && member.role !== "admin" && (
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
                    </div>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
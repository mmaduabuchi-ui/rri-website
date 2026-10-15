import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return Response.json(
      { error: `Unable to verify your session: ${authError.message}` },
      { status: 500 },
    );
  }

  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return Response.json(
      { error: `Unable to verify administrator access: ${profileError.message}` },
      { status: 500 },
    );
  }

  if (profile?.role !== "admin") {
    return Response.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  }

  const { id } = await params;
  if (!uuidPattern.test(id)) {
    return Response.json(
      { error: "A valid application ID is required." },
      { status: 400 },
    );
  }

  const { data: approvedProfileId, error } = await supabase.rpc(
    "approve_membership_application",
    { p_application_id: id },
  );

  if (error) {
    if (error.code === "42501") {
      return Response.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    if (error.code === "P0002" && error.message === "Membership application not found.") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    if (
      ["P0002", "21000", "22023", "23505", "40001"].includes(error.code ?? "")
    ) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Unable to approve membership application:", error.message);
    return Response.json(
      { error: "Unable to approve this membership application." },
      { status: 500 },
    );
  }

  if (typeof approvedProfileId !== "string") {
    console.error("Membership approval RPC returned no profile ID.");
    return Response.json(
      { error: "Unable to confirm membership approval." },
      { status: 500 },
    );
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/members");
  revalidatePath("/dashboard");

  return Response.json({ approved_profile_id: approvedProfileId });
}

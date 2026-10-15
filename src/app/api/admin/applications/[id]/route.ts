import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const applicationStatuses = [
  "pending",
  "under_review",
  "accepted",
  "rejected",
] as const;

type ApplicationStatus = (typeof applicationStatuses)[number];

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    applicationStatuses.some((status) => status === value)
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    return Response.json(
      { error: `Unable to verify your session: ${authError.message}` },
      { status: 500 },
    );
  }

  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await authClient
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
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return Response.json(
      { error: "A valid application ID is required." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("application_status" in body) ||
    !isApplicationStatus(body.application_status)
  ) {
    return Response.json(
      { error: "A valid application status is required." },
      { status: 400 },
    );
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("membership_applications")
    .update({ application_status: body.application_status })
    .eq("id", id)
    .is("approved_profile_id", null)
    .select("id, application_status")
    .maybeSingle();

  if (error) {
    return Response.json(
      { error: `Unable to update application status: ${error.message}` },
      { status: 500 },
    );
  }

  if (!data) {
    const { data: existingApplication, error: lookupError } = await adminClient
      .from("membership_applications")
      .select("approved_profile_id")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      return Response.json(
        { error: `Unable to verify application status: ${lookupError.message}` },
        { status: 500 },
      );
    }

    if (!existingApplication) {
      return Response.json({ error: "Application not found." }, { status: 404 });
    }

    if (existingApplication.approved_profile_id) {
      return Response.json(
        { error: "Application status cannot change after member approval." },
        { status: 409 },
      );
    }

    return Response.json(
      { error: "Application status changed; refresh and try again." },
      { status: 409 },
    );
  }

  revalidatePath("/admin/applications");
  return Response.json({
    id: data.id,
    application_status: data.application_status,
  });
}

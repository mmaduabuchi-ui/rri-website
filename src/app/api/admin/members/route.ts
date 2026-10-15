import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return Response.json(
      { error: "Administrator access required." },
      { status: 403 },
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

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    name,
    email,
    password,
    role,
    country,
    city,
  } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return Response.json(
      { error: "Name, email, and a password (min 8 chars) are required." },
      { status: 400 },
    );
  }

  if (role !== "member" && role !== "admin") {
    return Response.json({ error: "Invalid role." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (createError || !created.user) {
    return Response.json(
      { error: createError?.message ?? "Unable to create user." },
      { status: 400 },
    );
  }

  // The trigger handle_new_user already created the profile row.
  // Update role, country, city.
  const { error: updateError } = await admin
    .from("profiles")
    .update({
      role,
      country: typeof country === "string" ? country : null,
      city: typeof city === "string" ? city : null,
    })
    .eq("id", created.user.id);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }

  return Response.json(
    { id: created.user.id, email: created.user.email, role },
    { status: 201 },
  );
}
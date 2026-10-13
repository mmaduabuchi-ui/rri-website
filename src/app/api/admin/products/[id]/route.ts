import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
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
  const { data: deletedProduct, error: deleteError } = await createAdminClient()
    .from("products")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 400 });
  }
  if (!deletedProduct) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ ok: true });
}

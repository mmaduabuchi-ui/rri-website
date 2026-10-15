import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireApprovedMember() {
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

  if (
    profile?.role !== "admin" &&
    profile?.membership_status !== "approved"
  ) {
    redirect("/membership-pending");
  }

  return { user, isAdmin: profile.role === "admin" };
}

// src/app/admin/settings/page.tsx
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import SettingsForm, {
  type SettingsValues,
} from "@/components/admin/SettingsForm";

const REQUIRED_KEYS = [
  "admin_email",
  "admin_whatsapp",
  "payment_bank",
  "payment_account",
  "payment_name",
] as const;

export default async function AdminSettingsPage() {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError) {
    throw new Error(`Unable to verify your session: ${authError.message}`);
  }
  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Unable to verify administrator access: ${profileError.message}`,
    );
  }
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data, error } = await createAdminClient()
    .from("settings")
    .select("key, value");

  if (error) {
    throw new Error(`Unable to load settings: ${error.message}`);
  }

  const map = new Map((data ?? []).map((row) => [row.key, row.value]));
  const initial = Object.fromEntries(
    REQUIRED_KEYS.map((key) => [key, map.get(key) ?? ""]),
  ) as SettingsValues;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Site Settings
          </h1>
          <p className="mt-3 text-gray-600">
            Contact details and payment information shown to members.
          </p>
        </header>

        <SettingsForm initial={initial} />
      </div>
    </main>
  );
}
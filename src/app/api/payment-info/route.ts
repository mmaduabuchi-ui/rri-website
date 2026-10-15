// src/app/api/payment-info/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const EXPOSED_KEYS = [
  "payment_bank",
  "payment_account",
  "payment_name",
  "admin_whatsapp",
] as const;

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("settings")
    .select("key, value")
    .in("key", EXPOSED_KEYS as unknown as string[]);

  if (error) {
    return NextResponse.json(
      { error: `Unable to load payment info: ${error.message}` },
      { status: 500 },
    );
  }

  const map = new Map((data ?? []).map((row) => [row.key, row.value]));

  return NextResponse.json({
    bank: map.get("payment_bank") ?? "",
    account: map.get("payment_account") ?? "",
    name: map.get("payment_name") ?? "",
    whatsapp: map.get("admin_whatsapp") ?? "",
  });
}
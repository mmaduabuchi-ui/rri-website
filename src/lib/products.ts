// src/lib/products.ts
import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  type: "free" | "paid" | "donation";
  media_type: "video" | "audio" | "text" | "link" | null;
  price: number | null;
  cover_url: string | null;
  content: string | null;         // null for guests on paid products
  external_url: string | null;    // null for guests on paid products
  storage_path: string | null;    // null for guests on paid products
  has_access: boolean;            // computed by the view
  created_at: string;
};

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products_safe")
    .select(
      "id, title, description, type, media_type, price, cover_url, content, external_url, storage_path, has_access, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts failed:", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}
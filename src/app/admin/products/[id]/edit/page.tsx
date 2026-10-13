import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EditProductForm, {
  type EditableProduct,
} from "@/components/admin/EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: product, error: productError } = await createAdminClient()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (productError) {
    throw new Error(`Unable to load product: ${productError.message}`);
  }
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[#0B1B3D]">Edit Product</h1>
      <EditProductForm product={product as EditableProduct} />
    </main>
  );
}

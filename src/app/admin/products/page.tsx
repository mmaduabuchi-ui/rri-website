// src/app/admin/products/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  title: string | null;
  name?: string | null;
  description: string | null;
  type: string | null;
  media_type: string | null;
  price: number | null;
  created_at: string | null;
};

const typeStyles: Record<string, string> = {
  free: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  donation: "bg-yellow-100 text-yellow-900",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, description, type, media_type, price, created_at")
    .order("created_at", { ascending: false });

  async function deleteProduct(formData: FormData) {
    "use server";

    // Re-verify admin inside the action — do not trust the page render alone.
    const actionClient = await createClient();
    const {
      data: { user: actionUser },
    } = await actionClient.auth.getUser();

    if (!actionUser) {
      throw new Error("Authentication required.");
    }

    const { data: actionProfile } = await actionClient
      .from("profiles")
      .select("role")
      .eq("id", actionUser.id)
      .maybeSingle();

    if (actionProfile?.role !== "admin") {
      throw new Error("Administrator access required.");
    }

    const id = formData.get("id");
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("A valid product ID is required.");
    }

    // Remove any access grants first to avoid FK violations.
    await createAdminClient()
      .from("product_access")
      .delete()
      .eq("product_id", id);

    const { data: deleted, error: deleteError } = await createAdminClient()
      .from("products")
      .delete()
      .eq("id", id)
      .select("id");

    if (deleteError) {
      throw new Error(`Unable to delete product: ${deleteError.message}`);
    }
    if (!deleted?.length) {
      throw new Error("Product not found; nothing was deleted.");
    }

    revalidatePath("/admin/products");
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage products available on the website.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-600">
          Could not load products: {error.message}
        </p>
      ) : !products?.length ? (
        <div className="py-12">
          <p className="text-gray-600">No products found.</p>
          <Link
            href="/admin/products/new"
            className="mt-3 inline-block text-blue-600 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Media</th>
                <th className="py-3 pr-4 font-medium">Created</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(products as ProductRow[]).map((product) => {
                const displayTitle =
                  product.title ?? product.name ?? "Untitled product";
                const typeClass =
                  typeStyles[(product.type ?? "").toLowerCase()] ??
                  "bg-gray-100 text-gray-800";

                return (
                  <tr key={product.id} className="border-t border-gray-200">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-gray-900">
                        {displayTitle}
                      </p>
                      {product.description && (
                        <p className="mt-1 max-w-md text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      {product.type ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${typeClass}`}
                        >
                          {product.type}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {product.media_type ?? "—"}
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteProduct}>
                          <input
                            type="hidden"
                            name="id"
                            value={product.id}
                          />
                          <button
                            type="submit"
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
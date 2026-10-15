
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

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
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Created</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-gray-900">
                      {product.title ?? product.name ?? "Untitled product"}
                    </p>
                    {product.description && (
                      <p className="mt-1 max-w-md text-gray-500">
                        {product.description}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {product.status ?? "Not set"}
                  </td>
                  <td className="py-4 pr-4 text-gray-600">
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
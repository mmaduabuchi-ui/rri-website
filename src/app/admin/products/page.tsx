import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

const typeBadgeStyles: Record<string, string> = {
  free: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  donation: "bg-purple-100 text-purple-800",
};

export default async function AdminProductsPage() {
  const supabase = await createAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Unable to load products: ${error.message}`);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#0B1B3D]">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-[#F7B500] px-4 py-2 font-semibold text-[#0B1B3D] transition hover:bg-[#e5a700]"
        >
          New Product
        </Link>
      </header>

      {!products?.length ? (
        <p className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-gray-600">
          No products yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Media</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const type = String(product.type ?? "").toLowerCase();
                const media = product.media_type ?? product.media ?? "—";

                return (
                  <tr key={product.id} className="text-[#0B1B3D]">
                    <td className="px-5 py-4 font-medium">{product.title}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          typeBadgeStyles[type] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {type || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 capitalize">{String(media)}</td>
                    <td className="px-5 py-4">
                      {product.price == null
                        ? "—"
                        : `$${Number(product.price).toFixed(2)}`}
                    </td>
                    <td className="px-5 py-4">
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm font-semibold text-[#1E824C] hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
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
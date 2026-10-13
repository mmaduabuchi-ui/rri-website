import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ArticleRow = {
  id: string;
  title: string;
  kind: string;
  status: string;
  created_at: string;
};

const kindStyles: Record<string, string> = {
  article: "bg-blue-100 text-blue-800",
  news: "bg-gray-100 text-gray-800",
  announcement: "bg-yellow-100 text-yellow-900",
  emergency: "bg-red-100 text-red-800",
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Unable to verify your session: ${userError.message}`);
  }
  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to verify administrator access: ${profileError.message}`);
  }
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }
}

export default async function AdminArticlesPage() {
  await requireAdmin();

  const { data, error } = await createAdminClient()
    .from("articles")
    .select("id, title, kind, status, created_at")
    .order("created_at", { ascending: false });

  const articles = (data ?? []) as ArticleRow[];

  async function deleteArticle(formData: FormData) {
    "use server";

    await requireAdmin();

    const id = formData.get("id");
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("A valid article ID is required to delete an article.");
    }

    const { data: deletedArticles, error: deleteError } =
      await createAdminClient()
        .from("articles")
        .delete()
        .eq("id", id)
        .select("id");

    if (deleteError) {
      throw new Error(`Unable to delete article: ${deleteError.message}`);
    }
    if (!deletedArticles?.length) {
      throw new Error("Article not found; nothing was deleted.");
    }

    revalidatePath("/admin/articles");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Articles &amp; Updates
          </h1>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#F7B500] px-5 py-3 font-bold text-[#0B1B3D] transition hover:bg-[#dca200]"
          >
            New Post
          </Link>
        </header>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {error ? (
            <p role="alert" className="p-6 text-sm text-red-700">
              Unable to load articles: {error.message}
            </p>
          ) : articles.length === 0 ? (
            <p className="p-6 text-gray-600">No articles or updates found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Title
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Kind
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Created
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#0B1B3D]">
                        {article.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            kindStyles[article.kind.toLowerCase()] ??
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {article.kind}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.status.toLowerCase() === "published"
                          ? "Published"
                          : "Draft"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(article.created_at))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="text-sm font-semibold text-[#1E824C] hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={deleteArticle}>
                            <input
                              type="hidden"
                              name="id"
                              value={article.id}
                            />
                            <button
                              type="submit"
                              className="text-sm font-semibold text-red-700 hover:underline"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
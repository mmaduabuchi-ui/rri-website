// src/app/admin/articles/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EditArticleForm, {
  type EditableArticle,
} from "@/components/admin/EditArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: article, error: articleError } = await createAdminClient()
    .from("articles")
    .select(
      "id, title, excerpt, body, kind, category, cover_url, media_type, media_url, media_caption, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (articleError) {
    throw new Error(`Unable to load article: ${articleError.message}`);
  }
  if (!article) {
    notFound();
  }

  return <EditArticleForm article={article as EditableArticle} />;
}
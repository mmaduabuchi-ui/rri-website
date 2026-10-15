// src/app/knowledge-centre/page.tsx
import Link from "next/link";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";
import LibraryGrid from "@/components/knowledge/LibraryGrid";
import ArticlesList from "@/components/knowledge/ArticlesList";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/products";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function KnowledgeCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [products, articles] = await Promise.all([
    getProducts(),
    getArticles(),
  ]);

  const isSignedIn = Boolean(user);

  return (
    <main>
      <PageHero
        eyebrow="Knowledge Centre"
        title="Books, articles, and resources for clear thinkers."
        description="A growing library of publications, workbooks, guides, and daily articles designed to support your journey of understanding."
      />

      {/* Books & Publications */}
      <section
        id="books"
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="books-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Books &amp; Publications
            </p>

            <h2
              id="books-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Our library.
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              Download books, workbooks, and guides created by RRI and our
              contributors.
            </p>
          </div>

          <LibraryGrid items={products} isSignedIn={isSignedIn} />

          {!isSignedIn && (
            <div className="mt-12 flex justify-center">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
              >
                Create an account to unlock paid resources
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Daily Articles */}
      <section
        id="articles"
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="articles-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Daily Articles
            </p>

            <h2
              id="articles-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Perspectives for clear thinking.
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              Short reflections and longer essays on truth, clarity, personal
              growth, and conscious living.
            </p>
          </div>

          <ArticlesList items={articles} />
        </Container>
      </section>
    </main>
  );
}
// src/app/knowledge-centre/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";
import ArticlesList from "@/components/knowledge/ArticlesList";
import LibraryGrid from "@/components/knowledge/LibraryGrid";
import { getArticles } from "@/lib/articles";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge Centre",
  description:
    "Books, publications, articles and resources from Realise Reality Initiative.",
};

export default async function KnowledgeCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [articles, products] = await Promise.all([
    getArticles(),
    getProducts(),
  ]);

  return (
    <main>
      <PageHero
        eyebrow="Knowledge Centre"
        title="Books, articles, and resources for clear thinkers."
        description="Explore our growing library of publications and daily articles."
      />

      <section id="books" className="bg-[#F5F7FA] py-16 sm:py-20">
        <Container>
          <h2 className="text-center text-3xl font-bold text-[#0B1B3D]">
            Books &amp; Publications
          </h2>
          <LibraryGrid items={products} isSignedIn={Boolean(user)} />
        </Container>
      </section>

      <section id="articles" className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-center text-3xl font-bold text-[#0B1B3D]">
            Daily Articles
          </h2>
          <ArticlesList items={articles} />
        </Container>
      </section>
    </main>
  );
}
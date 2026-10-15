import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";
import LibraryGrid from "@/components/knowledge/LibraryGrid";
import ArticlesList from "@/components/knowledge/ArticlesList";
import { createClient } from "@/lib/supabase/server";

export default async function KnowledgeCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Unable to verify your session: ${authError.message}`);
  }

  if (!user) {
    return (
      <main>
        <PageHero
          eyebrow="Knowledge Centre"
          title="Members-only resources."
          description="Sign in with an approved RRI member account to access our library of books, guides, workbooks, and daily articles."
        />

        <section className="bg-[#F5F7FA] py-20 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl text-[#F7B500]">
                🔒
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#0B1B3D] sm:text-3xl">
                This area is for members.
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                The Knowledge Centre contains our growing library of books,
                workbooks, guides, and daily articles — designed to help you
                think clearly, live consciously, and grow meaningfully.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                Access is available after an administrator approves your
                membership.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#1E824C] px-7 py-3.5 font-semibold text-[#1E824C] transition-colors hover:bg-[#1E824C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
                >
                  Create an account
                </Link>

                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#1E824C] px-7 py-3.5 font-semibold text-[#1E824C] transition-colors hover:bg-[#1E824C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, membership_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to verify membership: ${profileError.message}`);
  }

  if (
    profile?.role !== "admin" &&
    profile?.membership_status !== "approved"
  ) {
    redirect("/membership-pending");
  }

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

          <LibraryGrid />
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

          <ArticlesList />
        </Container>
      </section>

      {/* Access note */}
      <section className="bg-white py-12">
        <Container>
          <p className="mx-auto max-w-2xl text-center text-xs leading-6 text-gray-500">
            Knowledge Centre access is available to signed-in members whose
            membership has been approved.
          </p>
        </Container>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Insights & Resources | Realise Reality Initiative",
  description:
    "Explore ideas, perspectives, and resources from Realise Reality Initiative on critical thinking, personal growth, reality, and conscious living.",
  keywords: [
    "RRI insights",
    "critical thinking",
    "personal growth",
    "conscious living",
    "reality and perception",
    "self-awareness",
    "intentional living",
  ],
  openGraph: {
    title: "Insights & Resources | Realise Reality Initiative",
    description: "Explore ideas, perspectives, and resources from Realise Reality Initiative on critical thinking, personal growth, reality, and conscious living.",
    url: "https://www.realise-reality.org/insights",
    siteName: "Realise Reality Initiative",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Resources | Realise Reality Initiative",
    description: "Explore ideas, perspectives, and resources from Realise Reality Initiative on critical thinking, personal growth, reality, and conscious living.",
  },
  alternates: {
    canonical: "https://www.realise-reality.org/insights",
  },
};

const topics = [
  {
    number: "01",
    title: "Critical Thinking",
    description:
      "Explore ideas that encourage questioning, analysis, evidence-based reasoning, and independent thought.",
  },
  {
    number: "02",
    title: "Personal Growth",
    description:
      "Discover perspectives and practical ideas that support self-awareness, personal development, and intentional living.",
  },
  {
    number: "03",
    title: "Reality & Perception",
    description:
      "Examine how perception, assumptions, experiences, and information shape the way we understand reality.",
  },
  {
    number: "04",
    title: "Conscious Living",
    description:
      "Explore ways to make more intentional decisions and live with greater awareness of yourself and your environment.",
  },
];

export default function InsightsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Insights & Resources"
        title="Ideas that help you understand life more clearly."
        description="Explore perspectives and resources designed to encourage critical thinking, personal growth, conscious living, and deeper understanding."
      />

      {/* Introduction */}
      <section 
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="intro-heading"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Knowledge & Perspectives
            </p>

            <h2 
              id="intro-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Think deeper. Understand better.
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
              Our resources are designed to help people examine ideas,
              challenge assumptions, understand different perspectives, and
              develop a clearer view of the world around them.
            </p>
          </div>
        </Container>
      </section>

      {/* Topics */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="topics-heading"
      >
        <Container>
          <h2 id="topics-heading" className="sr-only">
            Topics and Resources
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {topics.map((topic) => (
              <article
                key={topic.number}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#1E824C] focus-within:ring-offset-2 sm:p-10"
                aria-labelledby={`topic-${topic.number}-heading`}
              >
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1B3D] text-sm font-bold text-[#F7B500] transition-colors duration-300 group-hover:bg-[#1E824C]"
                  aria-hidden="true"
                >
                  {topic.number}
                </div>

                <h2 
                  id={`topic-${topic.number}-heading`}
                  className="mt-6 text-2xl font-bold text-[#0B1B3D]"
                >
                  {topic.title}
                </h2>

                <p className="mt-4 leading-8 text-gray-600">
                  {topic.description}
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E824C] transition group-hover:gap-3">
                    Explore {topic.title.toLowerCase()}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Future Resources */}
      <section 
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="future-heading"
      >
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl bg-[#0B1B3D] px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F7B500]">
              Coming Soon
            </p>

            <h2 
              id="future-heading"
              className="mt-4 text-3xl font-bold text-white sm:text-4xl"
            >
              A growing library of knowledge.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              As RRI develops, this space will grow into a library of articles,
              research, guides, educational materials, event recordings, and
              other resources to support your journey of understanding.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/get-involved"
                className="inline-block rounded-lg bg-[#1E824C] px-8 py-3 font-semibold text-white transition hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
              >
                Stay Updated
              </a>
              <a
                href="/contact"
                className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0B1B3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
              >
                Contribute Ideas
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24"
        aria-labelledby="cta-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Join the Conversation
            </p>

            <h2 
              id="cta-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Share your thoughts and perspectives.
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
              Have an idea, perspective, or resource to share? We'd love to
              hear from you and collaborate on building a community of clear
              thinkers and intentional living.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-block rounded-lg bg-[#1E824C] px-8 py-3 font-semibold text-white transition hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
              >
                Share Your Thoughts
              </a>
              <a
                href="/get-involved"
                className="inline-block rounded-lg border-2 border-[#1E824C] px-8 py-3 font-semibold text-[#1E824C] transition hover:bg-[#1E824C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
              >
                Get Involved
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
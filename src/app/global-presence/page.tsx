import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";
import { regions } from "@/data/regions";

export const metadata: Metadata = {
  title: "Global Presence | Realise Reality Initiative",
  description:
    "RRI's global impact across multiple countries and regions. Join our worldwide movement of clarity, intentionality, and impact.",
  keywords: ["RRI global", "international", "worldwide impact", "global presence"],
  openGraph: {
    title: "Global Presence | Realise Reality Initiative",
    description: "RRI's global impact across multiple countries and regions.",
    url: "https://www.realise-reality.org/global-presence",
    siteName: "Realise Reality Initiative",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Presence | Realise Reality Initiative",
    description: "RRI's global impact across multiple countries and regions.",
  },
};

export default function GlobalPresencePage() {
  return (
    <main>
      <PageHero
        eyebrow="Global Presence"
        title="Making an impact across borders."
        description="RRI is committed to creating a global movement of clarity, intentionality, and impact across continents and cultures."
      />

      {/* Regions Grid */}
      <section 
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="regions-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Where We Work
            </p>

            <h2 
              id="regions-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Building a global community.
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600">
              From our headquarters to international partnerships, RRI is 
              creating impact across the globe.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <article
                key={region.name}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-[#1E824C] focus-within:ring-offset-2"
                aria-labelledby={`region-${region.name.toLowerCase().replace(/\s+/g, '-')}-heading`}
              >
                <div className="mb-4 text-4xl">{region.flag}</div>

                <h3 
                  id={`region-${region.name.toLowerCase().replace(/\s+/g, '-')}-heading`}
                  className="text-xl font-bold text-[#0B1B3D]"
                >
                  {region.name}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {region.description}
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#1E824C]">
                    Initiatives:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {region.initiatives.map((initiative) => (
                      <li key={initiative} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#1E824C]" aria-hidden="true">•</span>
                        {initiative}
                      </li>
                    ))}
                  </ul>
                </div>

                {region.impact && (
                  <div className="mt-4 rounded-lg bg-[#F5F7FA] p-3">
                    <p className="text-sm font-semibold text-[#0B1B3D]">
                      Impact: {region.impact}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Global Impact Section */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="impact-heading"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Global Impact
            </p>

            <h2 
              id="impact-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Our reach across the world.
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="text-4xl font-bold text-[#1E824C]">4+</div>
                <p className="mt-2 text-sm text-gray-600">Countries with active programs</p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="text-4xl font-bold text-[#1E824C]">Growing</div>
                <p className="mt-2 text-sm text-gray-600">Global community of participants</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B1B3D] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Join our global movement
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Wherever you are in the world, there's a place for you at RRI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/get-involved"
                className="inline-block rounded-lg bg-[#1E824C] px-8 py-3 font-semibold text-white transition hover:bg-[#16663A]"
              >
                Get Involved
              </a>
              <a
                href="/contact"
                className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0B1B3D]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
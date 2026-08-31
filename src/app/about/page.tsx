import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "About Us | Realise Reality Initiative",
  description:
    "Learn about Realise Reality Initiative (RRI), our vision, mission, and core values. We help people see life through the lens of truth.",
  keywords: ["about RRI", "Realise Reality Initiative", "mission", "vision", "core values", "truth", "clarity"],
  openGraph: {
    title: "About Realise Reality Initiative | RRI",
    description: "Learn about RRI's mission, vision, and core values. We help people see life through the lens of truth.",
    url: "https://www.realise-reality.org/about",
    siteName: "Realise Reality Initiative",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Realise Reality Initiative | RRI",
    description: "Learn about RRI's mission, vision, and core values. We help people see life through the lens of truth.",
  },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About RRI"
        title="Helping people see life through the lens of truth."
        description="We challenge assumptions, encourage critical thinking, and promote conscious living in a complex and ever-changing world."
      />

      {/* Who We Are */}
      <section 
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="who-we-are-heading"
      >
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Who We Are
            </p>

            <h2 
              id="who-we-are-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              A global, impact-driven initiative.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-gray-600 sm:text-lg">
              <p>
                Realise Reality Initiative (RRI) is a global, impact-driven
                organization focused on helping individuals see life through the
                lens of truth.
              </p>

              <p>
                We exist to challenge assumptions, encourage critical thinking, and
                promote conscious living in a complex and ever-changing world.
              </p>

              <p>
                Through our programs, workshops, and initiatives, we equip people
                with the tools they need to navigate life with clarity, purpose,
                and integrity.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="vision-mission-heading"
      >
        <h2 id="vision-mission-heading" className="sr-only">
          Our Vision and Mission
        </h2>
        
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Vision Card */}
            <article 
              className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md sm:p-10"
              aria-labelledby="vision-heading"
            >
              <div className="mb-4 inline-block rounded-full bg-[#1E824C]/10 px-4 py-1.5 text-sm font-semibold text-[#1E824C]">
                Our Vision
              </div>

              <h3 
                id="vision-heading"
                className="text-2xl font-bold text-[#0B1B3D] sm:text-3xl"
              >
                A world that sees reality clearly.
              </h3>

              <p className="mt-5 leading-8 text-gray-600">
                To build a world where individuals think clearly, act
                consciously, and live based on reality.
              </p>
            </article>

            {/* Mission Card */}
            <article 
              className="rounded-2xl bg-[#0B1B3D] p-8 text-white shadow-sm transition-all duration-300 hover:shadow-md sm:p-10"
              aria-labelledby="mission-heading"
            >
              <div className="mb-4 inline-block rounded-full bg-[#F7B500]/20 px-4 py-1.5 text-sm font-semibold text-[#F7B500]">
                Our Mission
              </div>

              <h3 
                id="mission-heading"
                className="text-2xl font-bold sm:text-3xl"
              >
                Empowering people through understanding.
              </h3>

              <p className="mt-5 leading-8 text-gray-300">
                To empower individuals globally through critical thinking,
                personal growth, and practical life understanding for real-life
                impact.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section 
        className="bg-white py-20 sm:py-24 lg:py-28"
        aria-labelledby="values-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Our Core Values
            </p>

            <h2 
              id="values-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Principles that guide our work.
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600">
              These six core values shape our culture, decisions, and the impact we create.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <article
                key={value.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-[#1E824C] focus-within:ring-offset-2"
                aria-labelledby={`value-${value.title.toLowerCase()}-heading`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1B3D] text-sm font-bold text-[#F7B500] transition-colors duration-300 group-hover:bg-[#1E824C]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="h-2 w-2 rounded-full bg-[#1E824C]/20 transition-colors duration-300 group-hover:bg-[#1E824C]"></div>
                </div>

                <h3 
                  id={`value-${value.title.toLowerCase()}-heading`}
                  className="text-xl font-bold text-[#0B1B3D]"
                >
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Why RRI Section */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="why-rri-heading"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Why RRI
            </p>

            <h2 
              id="why-rri-heading"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              What makes us different.
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold text-[#0B1B3D]">Clarity-Focused</h3>
                <p className="mt-2 text-sm text-gray-600">We prioritize understanding over assumptions</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-bold text-[#0B1B3D]">Global Reach</h3>
                <p className="mt-2 text-sm text-gray-600">We connect people across borders</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-bold text-[#0B1B3D]">Practical Impact</h3>
                <p className="mt-2 text-sm text-gray-600">We focus on real-world change</p>
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
              Join us in making a difference
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Whether through participation, partnership, or support, there's a place for you at RRI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/get-involved"
                className="inline-block rounded-lg bg-[#1E824C] px-8 py-3 font-semibold text-white transition hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
              >
                Get Involved
              </a>
              <a
                href="/contact"
                className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0B1B3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
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
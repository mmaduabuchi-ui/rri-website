import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Programs | Realise Reality Initiative",
  description:
    "Explore Realise Reality Initiative programs, training, workshops, awareness initiatives, and personal growth opportunities.",
  keywords: ["RRI programs", "training and development", "workshops", "personal growth", "awareness initiatives"],
  openGraph: {
    title: "Programs | Realise Reality Initiative",
    description:
      "Explore Realise Reality Initiative programs, training, workshops, awareness initiatives, and personal growth opportunities.",
    url: "https://www.realise-reality.org/programs",
    type: "website",
  },
};

const programs = [
  {
    number: "01",
    title: "Training & Development",
    description:
      "We provide structured learning experiences that develop critical thinking, self-awareness, and practical life skills.",
    icon: "🎓",
  },
  {
    number: "02",
    title: "Workshops & Events",
    description:
      "We organize interactive sessions that challenge perspectives, encourage dialogue, and inspire growth.",
    icon: "🎯",
  },
  {
    number: "03",
    title: "Awareness Initiatives",
    description:
      "We create content and campaigns that promote truth, clarity, and conscious living.",
    icon: "💡",
  },
  {
    number: "04",
    title: "Personal Growth Programs",
    description:
      "We guide individuals on a journey of understanding themselves, their environment, and reality more deeply.",
    icon: "🌱",
  },
];

export default function ProgramsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Programs"
        title="Learning, growth, awareness, and action."
        description="Our programs are designed to equip individuals with the mindset, skills, and awareness needed to navigate life effectively."
      />

      {/* Introduction */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="programs-intro">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Our Work
            </p>

            <h2 
              id="programs-intro"
              className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Developing people who can think clearly and act consciously.
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
              Our work focuses on practical understanding rather than simply
              providing information. We create experiences that encourage people
              to question assumptions, develop awareness, and apply what they
              learn to real life.
            </p>
          </div>
        </Container>
      </section>

      {/* Programs Grid */}
      <section 
        className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
        aria-labelledby="programs-grid"
      >
        <Container>
          <h2 id="programs-grid" className="sr-only">
            Our Programs
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <article
                key={program.number}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10"
                aria-labelledby={`program-${program.number}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl transition-colors duration-300 group-hover:bg-[#1E824C]">
                  <span role="img" aria-label={`${program.title} icon`}>
                    {program.icon}
                  </span>
                </div>

                <h3 
                  id={`program-${program.number}`}
                  className="mt-6 text-2xl font-bold text-[#0B1B3D]"
                >
                  {program.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-600">
                  {program.description}
                </p>

                <div className="mt-6 flex items-center text-sm font-semibold text-[#1E824C]">
                  <span>Learn more</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section 
        className="bg-white py-20 sm:py-24"
        aria-labelledby="cta-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 
              id="cta-heading"
              className="text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
            >
              Ready to learn, grow, and make an impact?
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Explore how you can participate in the Realise Reality Initiative
              community.
            </p>

            <a
              href="/get-involved"
              className="mt-8 inline-block rounded-lg bg-[#1E824C] px-8 py-3 font-semibold text-white transition hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
            >
              Get Involved
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
import Link from "next/link";

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

export default function ProgramsSection() {
  return (
    <section
      id="programs"
      className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28"
      aria-labelledby="programs-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
            Our Programs
          </p>

          <h2
            id="programs-heading"
            className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl"
          >
            Learning, growth, awareness, and action.
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
            Our programs are designed to equip individuals with the mindset,
            skills, and awareness needed to navigate life effectively.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.number}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1B3D] text-2xl transition-colors duration-300 group-hover:bg-[#1E824C]">
                <span role="img" aria-label={`${program.title} icon`}>
                  {program.icon}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#0B1B3D]">
                {program.title}
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                {program.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/get-involved"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E824C] px-8 py-3.5 font-semibold text-white transition hover:bg-[#16663A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C] focus-visible:ring-offset-2"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
}
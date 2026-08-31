const areas = [
  {
    number: "01",
    title: "Personal Development Programs",
    description:
      "Programs designed to help individuals develop self-awareness, critical thinking, and practical understanding for better decisions and meaningful growth.",
  },
  {
    number: "02",
    title: "Training & Workshops",
    description:
      "Structured learning experiences and interactive sessions that challenge perspectives, encourage dialogue, and develop practical life skills.",
  },
  {
    number: "03",
    title: "Awareness Initiatives",
    description:
      "Content and campaigns that promote truth, clarity, critical thinking, and conscious living in an increasingly complex world.",
  },
  {
    number: "04",
    title: "Global Collaboration",
    description:
      "Building partnerships and connections among individuals and organizations committed to clarity, truth, and meaningful global impact.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
            What We Do
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl lg:text-5xl">
            Turning clarity into meaningful action.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            We create opportunities for people to learn, think critically,
            develop themselves, and contribute to positive change.
          </p>
        </div>

        {/* Program cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {areas.map((area) => (
            <article
              key={area.number}
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1B3D] text-sm font-bold text-[#F7B500] transition-colors duration-300 group-hover:bg-[#1E824C]">
                {area.number}
              </div>

              <h3 className="mt-6 text-xl font-bold leading-snug text-[#0B1B3D]">
                {area.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {area.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

export default function Introduction() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Section heading */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl lg:text-5xl">
              Helping people see life with clarity, truth, and purpose.
            </h2>
          </div>

          {/* Introduction text */}
          <div className="space-y-6 text-base leading-8 text-gray-600 sm:text-lg">
            <p>
              Realise Reality Initiative is an international, non-profit,
              non-religious and non-political organisation committed to
              promoting critical thinking, life education, human development,
              practical knowledge and conscious living, while helping
              individuals understand reality, navigate life effectively and
              contribute meaningfully to humanity.
            </p>

            <div className="border-l-4 border-[#F7B500] pl-5">
              <p className="font-semibold text-[#0B1B3D]">
                Clear understanding creates better decisions. Better decisions
                create meaningful impact.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="/about" className="btn-learn-more text-base font-semibold">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
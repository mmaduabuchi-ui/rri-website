import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0B1B3D] py-20 sm:py-24 lg:py-28">
      {/* Decorative elements */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#1E824C]/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-[#F7B500]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F7B500]">
          Be Part of the Movement
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          See clearly. Live intentionally. Make an impact.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
          Join a growing global community committed to clarity, truth, and
          meaningful impact. Your journey toward greater understanding can
          start today.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/get-involved"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 text-base font-bold text-[#0B1B3D] transition-colors duration-200 hover:bg-[#dca200] focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
          >
            Join Us
          </Link>

          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
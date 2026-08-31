import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1B3D]">
      {/* Decorative background elements */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#1E824C]/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#F7B500]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#F7B500] sm:text-base">
            Realise Reality Initiative
          </p>

          {/* Main heading */}
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
            See Life Clearly.
            <span className="block">Live Intentionally.</span>
            <span className="block text-[#F7B500]">Impact Globally.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
            Helping you see life through the lens of truth.
          </p>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            We help individuals understand life with clarity, truth, and
            purpose—so they can make better decisions, live more consciously,
            and create meaningful impact in the world.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/get-involved"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 text-base font-bold text-[#0B1B3D] transition-all duration-200 hover:bg-[#dca200] focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
            >
              Join Us
            </Link>

            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3D]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
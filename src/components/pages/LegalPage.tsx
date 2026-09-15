import type { ReactNode } from "react";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";

export type LegalSection = {
  number: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
};

interface LegalPageProps {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
  closingTitle?: string;
  closingLines?: string[];
  closingMotto?: string;
}

export default function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  closingTitle,
  closingLines,
  closingMotto,
}: LegalPageProps) {
  return (
    <main>
      <PageHero eyebrow={eyebrow} title={title} description={intro[0] ?? ""} />

      <section className="bg-[#F5F7FA] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Meta */}
            <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white px-6 py-4 text-xs shadow-sm">
              <div>
                <span className="font-bold uppercase tracking-wider text-gray-400">
                  Effective Date:
                </span>{" "}
                <span className="font-semibold text-[#0B1B3D]">
                  {effectiveDate}
                </span>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-gray-400">
                  Last Updated:
                </span>{" "}
                <span className="font-semibold text-[#0B1B3D]">
                  {lastUpdated}
                </span>
              </div>
            </div>

            {/* Intro paragraphs */}
            {intro.length > 0 && (
              <div className="mb-10 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 text-sm leading-7 text-gray-700 shadow-sm sm:p-8 sm:text-base">
                {intro.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <article
                  key={section.number}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h2 className="text-lg font-bold text-[#0B1B3D] sm:text-xl">
                    {section.number}. {section.title}
                  </h2>

                  {section.paragraphs && section.paragraphs.length > 0 && (
                    <div className="mt-4 space-y-3 text-sm leading-7 text-gray-700 sm:text-base">
                      {section.paragraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-gray-700 sm:text-base">
                      {section.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {section.quote && (
                    <blockquote className="mt-5 border-l-4 border-[#F7B500] pl-5 italic font-semibold text-[#0B1B3D]">
                      {section.quote}
                    </blockquote>
                  )}
                </article>
              ))}
            </div>

            {/* Closing block */}
            {closingTitle && closingLines && (
              <div className="mt-12 rounded-2xl bg-[#0B1B3D] p-8 text-white sm:p-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F7B500]">
                  {closingTitle}
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-7 text-gray-200 sm:text-base">
                  {closingLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {closingMotto && (
                  <p className="mt-6 border-t border-white/10 pt-6 text-base font-semibold italic text-[#F7B500]">
                    {closingMotto}
                  </p>
                )}

                <p className="mt-4 text-xs text-gray-400">
                  Realise Reality Initiative — Helping you see life through the
                  lens of truth.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
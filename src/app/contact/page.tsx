import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Realise Reality Initiative for questions, collaboration, volunteering, partnerships, and general inquiries.",
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1QANYQ1r6k/?mibextid=wwXIfr",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/realiserealityinitiative?igsi=bDIxOWdxc3B2aXgw&utm_source=qr",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@realiserealityinitiative",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@realiserealityinitiativerri?si=4YbCBNyTDsLrZBGO",
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Get In Touch"
        title="We would love to hear from you."
        description="Have a question, idea, partnership proposal, or want to get involved? Reach out to Realise Reality Initiative."
      />

      <section className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Contact Information
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
              Let&apos;s start a conversation.
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              We welcome questions, ideas, collaboration opportunities,
              volunteer inquiries, and partnership proposals.
            </p>

            {/* Email */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1E824C]">
                Email
              </p>

              <a
                href="mailto:info@realisereality.org.ng"
                className="mt-2 inline-block break-all font-semibold text-[#0B1B3D] hover:text-[#1E824C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C]"
              >
                info@realisereality.org.ng
              </a>
            </div>

            {/* WhatsApp */}
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1E824C]">
                WhatsApp
              </p>

              <p className="mt-2 text-gray-600">
                Reach us directly or join the RRI community group.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="https://wa.me/2347066072561"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-[#0B1B3D] hover:text-[#1E824C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C]"
                >
                  Direct Message: +234 706 607 2561
                </a>

                <a
                  href="https://chat.whatsapp.com/Bxzq1q2cvlK5hWxlaMjPjj"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-[#0B1B3D] hover:text-[#1E824C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C]"
                >
                  Join WhatsApp Group
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1E824C]">
                Social Media
              </p>

              <p className="mt-2 text-gray-600">
                Follow RRI for updates, insights, initiatives, and
                opportunities to participate.
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Realise Reality Initiative on ${social.name}`}
                    className="font-semibold text-[#0B1B3D] hover:text-[#1E824C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E824C]"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0B1B3D] sm:text-3xl">
                  Send us a message
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Complete the form below and we&apos;ll get back to you.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
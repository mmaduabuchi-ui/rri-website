import Link from "next/link";

const footerSections = [
  {
    title: "Organisation",
    links: [
      { name: "About", href: "/#about" },
      { name: "Mission & Vision", href: "/#vision-mission-heading" },
      { name: "Our Team", href: "/#team" },
      { name: "Global Structure", href: "/global-presence" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Join RRI", href: "/get-involved" },
      { name: "Volunteer", href: "/get-involved#volunteer" },
      { name: "Become a Coordinator", href: "/get-involved#coordinator" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Programmes",
    links: [
      { name: "Programs", href: "/#programs" },
      { name: "Humanity", href: "/welfare" },
      { name: "Events", href: "/events" },
      { name: "Partnerships", href: "/partnerships" },
    ],
  },
  {
    title: "Knowledge Centre",
    links: [
      { name: "Books & Publications", href: "/knowledge-centre#books" },
      { name: "Daily Articles", href: "/knowledge-centre#articles" },
      { name: "Resources", href: "/knowledge-centre" },
      { name: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Code of Conduct", href: "/code-of-conduct" },
      { name: "Safeguarding Policy", href: "/safeguarding" },
    ],
  },
];

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
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/Bxzq1q2cvlK5hWxlaMjPjj",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1B3D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand Mantra */}
        <div className="mb-10 border-b border-white/10 pb-8">
          <h2 className="text-xl font-bold tracking-wide">
            REALISE REALITY INITIATIVE
          </h2>
          <p className="mt-2 text-sm text-[#F7B500]">
            Helping You See Life Through the Lens of Truth.
          </p>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7B500]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-300 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>© {currentYear} Realise Reality Initiative. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-300">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`RRI on ${social.name}`}
                className="transition-colors hover:text-[#F7B500]"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";

const footerSections = [
  {
    title: "Organisation",
    links: [
      { name: "About", href: "/about" },
      { name: "Global Structure", href: "/global-presence" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Join RRI", href: "/get-involved" },
      { name: "Volunteer", href: "/get-involved#volunteer" },
      { name: "Become a Coordinator", href: "/get-involved#coordinator" },
    ],
  },
  {
    title: "Knowledge",
    links: [
      { name: "Insights & Articles", href: "/insights" },
      { name: "Research & Manuals", href: "/insights#manuals" },
    ],
  },
  {
    title: "Programmes",
    links: [
      { name: "Education", href: "/programs#education" },
      { name: "Human Development", href: "/programs#development" },
      { name: "Humanitarian Work", href: "/welfare" },
      { name: "Events", href: "/events" },
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1B3D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand Mantra */}
        <div className="mb-10 border-b border-white/10 pb-8">
          <h2 className="text-xl font-bold tracking-wide">REALISE REALITY INITIATIVE</h2>
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
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} Realise Reality Initiative. All rights reserved.</p>
          <div className="flex gap-4 text-gray-300">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
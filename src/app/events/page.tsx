const newsItems = [
  {
    category: "Upcoming Event",
    title: "Global Realisean Summit 2026",
    date: "October 15, 2026",
    desc: "Join community coordinators and members worldwide for an interactive global symposium.",
  },
  {
    category: "Recent Activity",
    title: "Cross River Youth Empowerment Outreach",
    date: "August 20, 2026",
    desc: "RRI field teams delivered human development workshops across local schools and centers.",
  },
  {
    category: "Announcement",
    title: "Launch of the RRI Digital Learning Portal",
    date: "August 01, 2026",
    desc: "Registered members can now access introductory leadership manuals directly from their dashboard.",
  },
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            News & Events
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Stay updated with upcoming global gatherings, local activities, announcements, and impact stories.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <div key={item.title} className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div>
                <span className="inline-block rounded-full bg-[#0B1B3D]/5 px-3 py-1 text-xs font-bold text-[#0B1B3D]">
                  {item.category}
                </span>
                <p className="mt-3 text-xs text-gray-400">{item.date}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0B1B3D]">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <button className="text-sm font-bold text-[#0B1B3D] hover:text-[#F7B500]">
                  Read Full Details →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
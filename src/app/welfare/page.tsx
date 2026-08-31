import Link from "next/link";

const impactStats = [
  { label: "Lives Impacted", value: "10,000+" },
  { label: "Community Outreach Projects", value: "45+" },
  { label: "Active Humanitarian Volunteers", value: "350+" },
  { label: "Partner Organizations", value: "18" },
];

export default function WelfarePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Welfare & Humanitarian Work
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Extending hands of compassion, supporting vulnerable populations, and building sustainable community welfare projects.
          </p>
        </div>

        {/* Impact Dashboard */}
        <div className="mt-12 rounded-2xl bg-[#0B1B3D] p-8 text-white shadow-xl">
          <h2 className="text-center text-[#F7B500] text-sm font-bold uppercase tracking-wider">
            Our Verified Impact
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="p-4">
                <div className="text-3xl font-extrabold text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs font-medium text-gray-300 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1B3D]">Community Welfare</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Direct assistance programs targeted at alleviating local distress, providing relief materials, and establishing immediate safety nets.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1B3D]">Vulnerable-Community Support</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Targeted advocacy and developmental aid for underprivileged demographics, ensuring equal access to basic resources.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1B3D]">Volunteer Action Corps</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Mobilizing trained Realisean volunteers on the ground to lead rapid response and long-term humanitarian drives.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            href="/get-involved"
            className="inline-flex rounded-lg bg-[#F7B500] px-8 py-3.5 text-sm font-bold text-[#0B1B3D] hover:bg-[#dca200] transition-colors"
          >
            Join Humanitarian Field Team
          </Link>
        </div>

      </div>
    </main>
  );
}
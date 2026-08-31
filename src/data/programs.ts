export interface Program {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  duration?: string;
  targetAudience?: string;
}

export const programs: Program[] = [
  {
    id: 1,
    title: "Training & Development",
    slug: "training-development",
    description:
      "Equipping individuals with essential skills, knowledge, and tools for personal and professional growth.",
    icon: "🎓",
    features: [
      "Leadership and management training",
      "Professional skill development",
      "Career guidance and mentorship",
      "Practical workshops",
    ],
    duration: "12 weeks",
    targetAudience: "Young professionals and aspiring leaders",
  },
  {
    id: 2,
    title: "Workshops & Events",
    slug: "workshops-events",
    description:
      "Interactive and engaging sessions designed to foster learning, connection, and personal transformation.",
    icon: "📅",
    features: [
      "Interactive learning sessions",
      "Networking opportunities",
      "Expert facilitators",
      "Hands-on activities",
    ],
    duration: "1-3 days",
    targetAudience: "Open to all",
  },
  {
    id: 3,
    title: "Awareness Initiatives",
    slug: "awareness-initiatives",
    description:
      "Raising awareness on critical issues affecting individuals and communities through education and advocacy.",
    icon: "📢",
    features: [
      "Community outreach programs",
      "Advocacy campaigns",
      "Educational resources",
      "Public awareness events",
    ],
    duration: "Ongoing",
    targetAudience: "Community members and stakeholders",
  },
  {
    id: 4,
    title: "Personal Growth Programs",
    slug: "personal-growth",
    description:
      "Comprehensive programs designed to help individuals discover their purpose and develop their potential.",
    icon: "🌱",
    features: [
      "Purpose discovery workshops",
      "Mental wellness and resilience",
      "Goal setting and achievement",
      "Mindfulness and clarity practices",
    ],
    duration: "6-8 weeks",
    targetAudience: "Individuals seeking personal transformation",
  },
];
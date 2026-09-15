export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  cover?: string;
  readingMinutes?: number;
  featured?: boolean;
};

export const articleCategories = [
  "All",
  "Critical Thinking",
  "Personal Growth",
  "Conscious Living",
  "Reality & Perception",
  "Humanity",
  "Announcements",
] as const;

export const articles: Article[] = [
  {
    id: "1",
    slug: "the-question-behind-every-question",
    title: "The Question Behind Every Question",
    excerpt:
      "Before we can find better answers, we must learn to ask better questions. A short reflection on the discipline of honest inquiry.",
    author: "Ekpo (Collins) Bassey",
    date: "2026-09-10",
    category: "Critical Thinking",
    tags: ["Inquiry", "Reasoning", "Curiosity"],
    cover: "/images/photo_2026-08-31_19-17-48.jpg",
    readingMinutes: 4,
    featured: true,
  },
  {
    id: "2",
    slug: "seeing-what-is-already-there",
    title: "Seeing What Is Already There",
    excerpt:
      "Clarity is not something we add to life. It is something we uncover when we stop layering assumptions over what is directly in front of us.",
    author: "Realise Reality Initiative",
    date: "2026-09-08",
    category: "Reality & Perception",
    tags: ["Awareness", "Observation", "Clarity"],
    readingMinutes: 5,
    featured: true,
  },
  {
    id: "3",
    slug: "the-cost-of-not-thinking",
    title: "The Cost of Not Thinking",
    excerpt:
      "Every unexamined assumption has a price. This article explores how small mental shortcuts compound into larger life consequences.",
    author: "Dr. Kayode Adebayo",
    date: "2026-09-05",
    category: "Critical Thinking",
    tags: ["Decisions", "Bias", "Responsibility"],
    readingMinutes: 6,
  },
  {
    id: "4",
    slug: "healing-is-not-becoming-someone-new",
    title: "Healing Is Not Becoming Someone New",
    excerpt:
      "True healing is not the creation of a different self. It is the recovery of the self that was always there, beneath the layers of conditioning.",
    author: "Doreen Chikonde Mwelwa",
    date: "2026-09-02",
    category: "Personal Growth",
    tags: ["Healing", "Identity", "Authenticity"],
    readingMinutes: 7,
  },
  {
    id: "5",
    slug: "living-on-purpose-not-on-autopilot",
    title: "Living on Purpose, Not on Autopilot",
    excerpt:
      "Most people move through life on inherited scripts. Conscious living begins the moment we choose to write our own.",
    author: "Realise Reality Initiative",
    date: "2026-08-28",
    category: "Conscious Living",
    tags: ["Intentionality", "Choice", "Awareness"],
    readingMinutes: 5,
  },
  {
    id: "6",
    slug: "what-humanity-asks-of-us",
    title: "What Humanity Asks of Us",
    excerpt:
      "Humanitarian work is not charity. It is the recognition that every person's dignity is inseparable from our own.",
    author: "Hazel Campbell",
    date: "2026-08-22",
    category: "Humanity",
    tags: ["Compassion", "Service", "Dignity"],
    readingMinutes: 4,
  },
  {
    id: "7",
    slug: "rri-launches-knowledge-centre",
    title: "RRI Launches the Knowledge Centre",
    excerpt:
      "We are pleased to announce the launch of the RRI Knowledge Centre — a growing library of books, guides, and articles for clear thinkers.",
    author: "Realise Reality Initiative",
    date: "2026-08-15",
    category: "Announcements",
    tags: ["Knowledge Centre", "Launch", "Resources"],
    readingMinutes: 2,
  },
];

export function getLatestArticles(count: number = 3): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getFeaturedArticles(count: number = 2): Article[] {
  return articles.filter((a) => a.featured).slice(0, count);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
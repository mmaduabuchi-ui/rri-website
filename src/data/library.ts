export type LibraryItem = {
  id: string;
  title: string;
  author: string;
  type: "book" | "ebook" | "workbook" | "guide" | "report";
  description: string;
  cover?: string;
  fileUrl?: string;
  pages?: number;
  year?: number;
  tags: string[];
  featured?: boolean;
};

export const library: LibraryItem[] = [
  {
    id: "human-manual",
    title: "The Human Manual",
    author: "Ekpo (Collins) Bassey",
    type: "book",
    description:
      "A practical guide to understanding yourself, your mind, and the patterns that shape your life. Designed to help readers think clearly and live intentionally.",
    cover: "/images/photo_2026-08-31_19-17-48.jpg",
    fileUrl: "/books/the-human-manual.pdf",
    pages: 180,
    year: 2025,
    tags: ["Personal Growth", "Critical Thinking", "Self-Awareness"],
    featured: true,
  },
  {
    id: "journey-tigers-cage",
    title: "My Journey to the Tiger's Cage",
    author: "Ekpo (Collins) Bassey",
    type: "book",
    description:
      "A personal narrative of challenge, growth, and the lessons that come from facing life's hardest moments with clarity and courage.",
    cover: "/images/photo_2026-08-31_19-17-48.jpg",
    fileUrl: "/books/my-journey-to-the-tigers-cage.pdf",
    pages: 220,
    year: 2025,
    tags: ["Memoir", "Resilience", "Life Lessons"],
    featured: true,
  },
  {
    id: "inner-healing-codex",
    title: "The Inner Healing Codex",
    author: "Doreen Chikonde Mwelwa",
    type: "book",
    description:
      "A transformative guide that invites readers to examine the emotional patterns they carry, release inherited pain, and reconnect with the authentic self beneath layers of conditioning.",
    cover: "/images/photo_2026-08-31_19-29-50.jpg",
    fileUrl: "/books/the-inner-healing-codex.pdf",
    pages: 240,
    year: 2025,
    tags: ["Healing", "Self-Discovery", "Conscious Living"],
    featured: true,
  },
  {
    id: "critical-thinking-starter",
    title: "Critical Thinking Starter Guide",
    author: "Realise Reality Initiative",
    type: "guide",
    description:
      "An introductory guide to questioning assumptions, evaluating evidence, and building the mental habits that lead to clearer decisions.",
    fileUrl: "/books/critical-thinking-starter.pdf",
    pages: 48,
    year: 2026,
    tags: ["Critical Thinking", "Reasoning", "Education"],
  },
  {
    id: "conscious-living-workbook",
    title: "Conscious Living Workbook",
    author: "Realise Reality Initiative",
    type: "workbook",
    description:
      "A practical workbook with exercises, prompts, and reflection questions to help you apply conscious-living principles in daily life.",
    fileUrl: "/books/conscious-living-workbook.pdf",
    pages: 72,
    year: 2026,
    tags: ["Conscious Living", "Reflection", "Practical"],
  },
];

export const libraryTypes = [
  { value: "all", label: "All Resources" },
  { value: "book", label: "Books" },
  { value: "ebook", label: "E-Books" },
  { value: "workbook", label: "Workbooks" },
  { value: "guide", label: "Guides" },
  { value: "report", label: "Reports" },
] as const;
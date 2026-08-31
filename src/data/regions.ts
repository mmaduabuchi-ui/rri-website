export interface Region {
  id: number;
  name: string;
  flag: string;
  description: string;
  initiatives: string[];
  impact?: string;
}

export const regions: Region[] = [
  {
    id: 1,
    name: "Nigeria",
    flag: "🇳🇬",
    description: "Our headquarters and primary operations base in West Africa.",
    initiatives: [
      "Community programs",
      "Leadership training",
      "Youth empowerment",
      "Educational outreach",
    ],
    impact: "Reaching communities across Nigeria",
  },
  {
    id: 2,
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "International partnerships and program development hub.",
    initiatives: [
      "Strategic partnerships",
      "International program development",
      "Research and innovation",
      "Global networking",
    ],
    impact: "Connecting with global partners",
  },
  {
    id: 3,
    name: "Expanding Globally",
    flag: "🌍",
    description: "RRI is continuously expanding its reach to new regions and communities.",
    initiatives: [
      "New partnerships",
      "Global programs",
      "Cross-cultural exchange",
      "International collaboration",
    ],
    impact: "Growing global presence",
  },
];
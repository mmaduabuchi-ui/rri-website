import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | Realise Reality Initiative",
  description:
    "Terms of Use governing access to and use of Realise Reality Initiative's website, membership platform, online community, educational materials, programmes and events.",
  alternates: { canonical: "https://www.realise-reality.org/terms" },
};

const intro = [
  "Welcome to the official website and online platforms of Realise Reality Initiative (RRI).",
  "These Terms of Use (\"Terms\") govern your access to and use of the RRI website, membership platform, online community, educational materials, programmes, events and related services.",
  "By accessing or using any RRI platform, you agree to comply with these Terms. If you do not agree with these Terms, please do not use the relevant platform or services.",
];

const sections: LegalSection[] = [
  {
    number: "1",
    title: "About Realise Reality Initiative",
    paragraphs: [
      "Realise Reality Initiative (RRI) is an international, non-profit initiative focused on critical thinking, practical life education, human development, conscious living and meaningful contribution to humanity.",
      "RRI seeks to create an inclusive community where people can learn, question, discuss, develop and contribute without discrimination or coercion.",
      "Our guiding principle is:",
    ],
    quote: "Helping you see life through the lens of truth.",
  },
  {
    number: "2",
    title: "Eligibility",
    paragraphs: ["You may use RRI platforms provided that:"],
    bullets: [
      "You provide accurate information when requested.",
      "You comply with these Terms.",
      "You respect other members and participants.",
      "You have the legal capacity to enter into applicable agreements in your jurisdiction.",
    ],
  },
  {
    number: "2A",
    title: "Additional Requirements",
    paragraphs: [
      "Certain programmes may have additional eligibility requirements, which will be communicated separately.",
      "Where activities involve children or minors, additional safeguarding and consent requirements may apply.",
    ],
  },
  {
    number: "3",
    title: "Membership",
    paragraphs: [
      "Membership of RRI is intended to create a community of individuals who wish to participate in the Initiative's activities and contribute to its objectives.",
      "Membership does not automatically give an individual:",
    ],
    bullets: [
      "An employment relationship with RRI",
      "Authority to represent RRI publicly",
      "Authority to make financial commitments on behalf of RRI",
      "Authority to enter contracts on behalf of RRI",
      "A leadership position",
    ],
  },
  {
    number: "3A",
    title: "Assigning Positions",
    paragraphs: [
      "Official positions and responsibilities are assigned through RRI's established organisational procedures.",
    ],
  },
  {
    number: "4",
    title: "Accurate Information",
    paragraphs: [
      "When registering for RRI membership, volunteering or programmes, you agree to provide information that is accurate and reasonably up to date.",
      "You should not:",
    ],
    bullets: [
      "Register using another person's identity",
      "Create fraudulent accounts",
      "Deliberately provide misleading information",
      "Attempt to obtain organisational privileges through false information",
    ],
  },
  {
    number: "4A",
    title: "Consequences",
    paragraphs: [
      "RRI may suspend or terminate an account where there is reasonable evidence of serious misrepresentation or abuse.",
    ],
  },
  {
    number: "5",
    title: "Community Standards",
    paragraphs: [
      "RRI is committed to creating a community where people can express ideas, ask questions and disagree respectfully.",
      "Members are expected to:",
    ],
    bullets: [
      "Treat others with dignity",
      "Respect differences in background and opinion",
      "Engage in good-faith discussion",
      "Avoid harassment and intimidation",
      "Avoid threats or abusive behaviour",
      "Avoid discrimination",
      "Avoid deliberate misinformation presented as fact",
      "Respect the privacy of other members",
    ],
    quote: "Freedom of thought does not mean freedom to abuse others.",
  },
  {
    number: "6",
    title: "No Coercion of Belief",
    paragraphs: [
      "RRI encourages independent thinking and open inquiry.",
      "Participation in RRI does not require a person to adopt a particular religious, philosophical, political or ideological belief.",
      "Members are free to question, disagree, change their views and form their own conclusions.",
      "However, members must not use RRI platforms to deliberately coerce, intimidate or harass others into adopting or abandoning particular beliefs.",
    ],
  },
  {
    number: "7",
    title: "User-Generated Content",
    paragraphs: [
      "Members may have opportunities to submit:",
    ],
    bullets: [
      "Articles",
      "Opinions",
      "Educational materials",
      "Research",
      "Images",
      "Videos",
      "Comments",
      "Suggestions",
      "Other forms of content",
    ],
  },
  {
    number: "7A",
    title: "Responsibility for Content",
    paragraphs: [
      "You remain responsible for content you submit.",
      "By submitting content to an RRI platform, you confirm that:",
    ],
    bullets: [
      "You have the right to submit the content.",
      "The content does not knowingly violate another person's intellectual-property rights.",
      "The content does not unlawfully disclose another person's private information.",
      "The content does not contain unlawful, threatening or abusive material.",
    ],
  },
  {
    number: "8",
    title: "Content Moderation",
    paragraphs: [
      "RRI reserves the right to review, moderate, restrict or remove content that violates these Terms or applicable law.",
      "Moderation may include:",
    ],
    bullets: [
      "Removing content",
      "Issuing warnings",
      "Restricting participation",
      "Suspending accounts",
      "Removing individuals from programmes or communities",
      "Terminating membership where appropriate",
    ],
  },
  {
    number: "8A",
    title: "Consistency",
    paragraphs: [
      "RRI will seek to apply its standards fairly and consistently.",
    ],
  },
  {
    number: "9",
    title: "Intellectual Property",
    paragraphs: [
      "Unless otherwise stated, materials published by RRI — including its:",
    ],
    bullets: [
      "Name",
      "Logo",
      "Branding",
      "Website design",
      "Manuals",
      "Educational materials",
      "Publications",
      "Original graphics",
      "Videos",
      "Written materials",
      "Programmes and frameworks",
    ],
  },
  {
    number: "9A",
    title: "Permitted Use",
    paragraphs: [
      "Materials published by RRI are owned by or appropriately licensed to RRI and may be protected by applicable intellectual-property laws.",
      "You may not reproduce, modify, sell, distribute or commercially exploit RRI materials without appropriate permission.",
      "Limited personal and educational use may be permitted where clearly indicated.",
    ],
  },
  {
    number: "10",
    title: "RRI Name and Representation",
    paragraphs: [
      "The name Realise Reality Initiative, its logo and other official branding may only be used to represent RRI with appropriate authorisation.",
      "Members must not falsely represent themselves as:",
    ],
    bullets: [
      "An RRI executive",
      "An official RRI representative",
      "A country coordinator",
      "A chapter leader",
      "An authorised spokesperson",
      "An employee or agent of RRI",
    ],
  },
  {
    number: "10A",
    title: "Appointed Roles",
    paragraphs: [
      "No member may claim any of the above roles unless they have actually been appointed or authorised to hold that role.",
    ],
  },
  {
    number: "11",
    title: "Financial Activities",
    paragraphs: [
      "Unless expressly authorised, members must not collect money, donations, sponsorships or other financial contributions in the name of RRI.",
      "Any official fundraising activity must follow RRI's financial policies and applicable laws.",
      "RRI reserves the right to investigate suspected unauthorised fundraising or financial misrepresentation.",
    ],
  },
  {
    number: "12",
    title: "Educational Information",
    paragraphs: [
      "RRI may provide educational materials, opinions, discussions, research and practical guidance.",
      "Such content is intended for general educational and informational purposes.",
      "RRI does not guarantee that every statement, opinion or piece of user-generated content represents the official position of RRI.",
      "Where appropriate, members should independently verify important information and seek qualified professional advice for matters requiring specialised expertise, including medical, legal, financial or professional decisions.",
    ],
  },
  {
    number: "13",
    title: "External Links and Third-Party Services",
    paragraphs: [
      "RRI platforms may contain links to third-party websites, applications, social-media platforms or services.",
      "RRI does not control and is not responsible for:",
    ],
    bullets: [
      "Third-party content",
      "Third-party privacy practices",
      "Third-party security",
      "Availability of external services",
      "Transactions conducted with third parties",
    ],
  },
  {
    number: "13A",
    title: "Reviewing External Platforms",
    paragraphs: [
      "Users should review the terms and privacy policies of external platforms before using them.",
    ],
  },
  {
    number: "14",
    title: "Website Availability",
    paragraphs: [
      "We aim to keep our platforms available and functioning properly.",
      "However, RRI does not guarantee that the website or online services will always be:",
    ],
    bullets: [
      "Available",
      "Error-free",
      "Secure",
      "Free from interruptions",
    ],
  },
  {
    number: "14A",
    title: "Service Suspension",
    paragraphs: [
      "We may temporarily suspend services for maintenance, security, upgrades or other legitimate reasons.",
    ],
  },
  {
    number: "15",
    title: "Prohibited Activities",
    paragraphs: ["Users must not use RRI platforms to:"],
    bullets: [
      "Commit or facilitate unlawful activity",
      "Harass or threaten others",
      "Impersonate another person",
      "Distribute malicious software",
      "Attempt unauthorised access to systems",
      "Collect other members' information without authorisation",
      "Spam or conduct fraudulent activities",
      "Publish unlawful or seriously harmful content",
      "Infringe intellectual-property rights",
      "Misrepresent their relationship with RRI",
      "Conduct unauthorised fundraising in RRI's name",
    ],
  },
  {
    number: "16",
    title: "Volunteer Participation",
    paragraphs: [
      "RRI volunteers participate on the basis of agreed responsibilities and organisational policies.",
      "Unless expressly agreed otherwise in writing, volunteering for RRI does not create an employment relationship.",
      "Volunteer roles may be modified, suspended or terminated based on organisational needs, performance, conduct or other legitimate considerations.",
    ],
  },
  {
    number: "17",
    title: "International Participation",
    paragraphs: [
      "RRI welcomes participation from individuals across different countries.",
      "However, participation in RRI does not automatically establish RRI as a legally registered organisation in a participant's country.",
      "Country representatives, chapters and coordinators must comply with applicable local laws and RRI's organisational policies.",
      "No person may establish a legally registered RRI entity in another country without appropriate authorisation from the organisation and compliance with applicable laws.",
    ],
  },
  {
    number: "18",
    title: "Privacy",
    paragraphs: [
      "Your use of RRI platforms is also governed by our Privacy Policy, which explains how we collect, use, store and protect personal information.",
      "By using our platforms, you acknowledge that you have reviewed the applicable Privacy Policy.",
    ],
  },
  {
    number: "19",
    title: "Suspension or Termination",
    paragraphs: [
      "RRI may suspend or terminate access to its platforms, programmes or membership where an individual:",
    ],
    bullets: [
      "Seriously violates these Terms",
      "Engages in harassment or abuse",
      "Misuses RRI's name or resources",
      "Engages in fraud",
      "Poses a significant risk to other members or the organisation",
      "Violates applicable law",
      "Repeatedly violates community standards",
    ],
  },
  {
    number: "19A",
    title: "Appeals",
    paragraphs: [
      "Where appropriate, RRI may provide an opportunity for the individual to respond or appeal a decision in accordance with its internal procedures.",
    ],
  },
  {
    number: "20",
    title: "Changes to These Terms",
    paragraphs: [
      "RRI may update these Terms from time to time to reflect:",
    ],
    bullets: [
      "Changes in our activities",
      "Changes in technology",
      "Changes in organisational policies",
      "Changes in applicable laws",
      "Changes in our membership structure",
    ],
  },
  {
    number: "20A",
    title: "Acceptance of Updates",
    paragraphs: [
      "Updated Terms will be published on the website with a revised \"Last Updated\" date.",
      "Continued use of RRI platforms following an update may constitute acceptance of the revised Terms where permitted by applicable law.",
    ],
  },
  {
    number: "21",
    title: "Governing Law",
    paragraphs: [
      "These Terms shall be interpreted and applied in accordance with the laws applicable to the legal entity operating the relevant RRI platform, subject to any mandatory rights or protections that apply to users in their respective jurisdictions.",
      "Where RRI is legally established in Nigeria, applicable Nigerian law will govern matters within the jurisdiction of that entity, subject to applicable international and local legal requirements.",
    ],
  },
  {
    number: "22",
    title: "Contact",
    paragraphs: [
      "For questions concerning these Terms, please contact:",
    ],
    bullets: [
      "Realise Reality Initiative",
      "Email: realisereality@realisereality.org.ng",
      "Website: https://www.realise-reality.org",
      "Address: 56 Ikot Offiong Ambai, Akpabuyo LGA, Cross River State, Nigeria — Africa",
      "Subject: Terms of Use Enquiry",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of Use"
      title="The terms that govern your use of RRI platforms."
      effectiveDate="1 September 2026"
      lastUpdated="1 September 2026"
      intro={intro}
      sections={sections}
      closingTitle="Our Community Principle"
      closingLines={[
        "Think freely. Question honestly. Respect people. Seek understanding. Live consciously. Contribute meaningfully.",
      ]}
      closingMotto="Helping you see life through the lens of truth."
    />
  );
}
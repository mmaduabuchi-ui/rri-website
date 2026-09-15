import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Code of Conduct | Realise Reality Initiative",
  description:
    "The standards of behaviour expected from all RRI members, volunteers, coordinators, executives, representatives, facilitators, partners and participants.",
  alternates: { canonical: "https://www.realise-reality.org/code-of-conduct" },
};

const intro = [
  "This Code of Conduct establishes the standards of behaviour expected from all RRI members, volunteers, coordinators, executives, representatives, facilitators, partners and participants.",
  "Realise Reality Initiative (RRI) is committed to building an inclusive global community where people can think freely, question honestly, learn continuously, live consciously and contribute meaningfully to humanity.",
  "Our guiding principle is: Helping You See Life Through the Lens of Truth.",
];

const sections: LegalSection[] = [
  {
    number: "1",
    title: "Our Purpose",
    paragraphs: [
      "Realise Reality Initiative (RRI) is committed to building an inclusive global community where people can think freely, question honestly, learn continuously, live consciously and contribute meaningfully to humanity.",
      "This Code of Conduct establishes the standards of behaviour expected from all RRI members, volunteers, coordinators, executives, representatives, facilitators, partners and participants.",
    ],
    quote: "Helping You See Life Through the Lens of Truth.",
  },
  {
    number: "2",
    title: "Who This Code Applies To",
    paragraphs: [
      "This Code applies to anyone participating in RRI activities, including:",
    ],
    bullets: [
      "Members",
      "Realiseans",
      "Volunteers",
      "Coordinators",
      "Ambassadors",
      "Facilitators",
      "Executives",
      "Trustees",
      "Event participants",
      "Online community participants",
      "Representatives acting on behalf of RRI",
    ],
  },
  {
    number: "2A",
    title: "Scope",
    paragraphs: [
      "It applies both online and offline, including RRI websites, WhatsApp groups, social-media platforms, meetings, events, training sessions and community projects.",
    ],
  },
  {
    number: "3",
    title: "Respect for Human Dignity",
    paragraphs: [
      "Every person should be treated with dignity and respect regardless of:",
    ],
    bullets: [
      "Nationality",
      "Ethnicity",
      "Gender",
      "Age",
      "Disability",
      "Social or economic background",
      "Religion or non-religion",
      "Philosophical beliefs",
      "Political views",
      "Educational background",
      "Culture",
      "Personal circumstances",
    ],
  },
  {
    number: "3A",
    title: "Disagreeing with Ideas, Not People",
    paragraphs: [
      "RRI does not require people to share the same worldview.",
      "We can disagree with ideas without degrading the people who hold them.",
    ],
  },
  {
    number: "4",
    title: "Freedom of Thought and Expression",
    paragraphs: ["RRI encourages:"],
    bullets: [
      "Questions",
      "Healthy skepticism",
      "Debate",
      "Independent thinking",
      "Evidence-based reasoning",
      "Intellectual curiosity",
      "Changing one's mind when presented with better evidence",
    ],
  },
  {
    number: "4A",
    title: "Limits of Expression",
    paragraphs: [
      "Members should be able to express genuine opinions without fear of personal retaliation.",
      "However, freedom of expression does not include harassment, threats, intimidation, targeted abuse or unlawful conduct.",
    ],
  },
  {
    number: "5",
    title: "Seek Truth, Not Victory",
    paragraphs: [
      "RRI encourages members to approach discussions with a genuine desire to understand rather than simply to win arguments.",
      "Members should:",
    ],
    bullets: [
      "Distinguish facts from opinions",
      "Avoid deliberately presenting false information as fact",
      "Consider credible evidence",
      "Acknowledge uncertainty",
      "Correct significant mistakes when discovered",
      "Be willing to revise their views",
    ],
    quote: "Being wrong is not a disgrace. Refusing to learn is.",
  },
  {
    number: "6",
    title: "No Harassment or Bullying",
    paragraphs: ["RRI does not tolerate:"],
    bullets: [
      "Personal harassment",
      "Bullying",
      "Threats",
      "Intimidation",
      "Persistent unwanted contact",
      "Humiliation",
      "Hate-based abuse",
      "Sexual harassment",
      "Deliberate targeting of individuals",
      "Doxxing or exposure of private information",
    ],
  },
  {
    number: "6A",
    title: "Debate vs Abuse",
    paragraphs: [
      "Disagreement, criticism and debate are permitted.",
      "Abuse is not debate.",
    ],
  },
  {
    number: "7",
    title: "Respectful Disagreement",
    paragraphs: [
      "RRI is intentionally a space where people can challenge ideas.",
      "Members may criticise:",
    ],
    bullets: [
      "Religious beliefs",
      "Political ideas",
      "Philosophical positions",
      "Scientific claims",
      "Social systems",
      "Organisational decisions",
      "RRI itself",
    ],
  },
  {
    number: "7A",
    title: "Focus on Ideas",
    paragraphs: [
      "Criticism should focus on ideas, evidence and behaviour, rather than degrading individuals or entire groups of people.",
    ],
  },
  {
    number: "8",
    title: "Non-Coercion",
    paragraphs: [
      "No RRI member should pressure another person to:",
    ],
    bullets: [
      "Adopt a particular belief",
      "Abandon a particular belief",
      "Join a particular religion or ideology",
      "Leave a religion",
      "Donate money",
      "Participate in activities",
      "Accept a leadership position",
      "Reveal personal information",
    ],
  },
  {
    number: "8A",
    title: "Voluntary Participation",
    paragraphs: ["Participation in RRI should be voluntary."],
  },
  {
    number: "9",
    title: "Honesty and Integrity",
    paragraphs: [
      "Members representing RRI are expected to act honestly.",
      "They must not:",
    ],
    bullets: [
      "Falsify information",
      "Misrepresent qualifications",
      "Impersonate RRI officials",
      "Fabricate achievements",
      "Manipulate organisational records",
      "Misuse RRI resources",
      "Make unauthorised commitments on behalf of RRI",
    ],
  },
  {
    number: "9A",
    title: "Public Communication",
    paragraphs: [
      "RRI representatives must be especially careful when communicating publicly because their actions may affect the reputation of the entire organisation.",
    ],
  },
  {
    number: "10",
    title: "Responsible Use of RRI's Name",
    paragraphs: [
      "Only authorised persons may officially speak on behalf of RRI or make formal commitments on its behalf.",
      "Members must not:",
    ],
    bullets: [
      "Claim an office they do not hold",
      "Present personal opinions as official RRI positions",
      "Sign agreements on behalf of RRI without authority",
      "Collect money using RRI's name without approval",
      "Create unofficial branches claiming to be legally recognised RRI entities",
    ],
  },
  {
    number: "11",
    title: "Financial Integrity",
    paragraphs: [
      "Anyone handling RRI funds or resources must do so transparently and responsibly.",
      "Members must not:",
    ],
    bullets: [
      "Misappropriate organisational funds",
      "Use RRI funds for personal purposes without authorisation",
      "Conduct unauthorised fundraising",
      "Conceal financial transactions",
      "Falsify financial records",
    ],
  },
  {
    number: "11A",
    title: "Reporting Financial Misconduct",
    paragraphs: [
      "Any suspected financial misconduct should be reported through the appropriate organisational channel.",
    ],
  },
  {
    number: "12",
    title: "Confidentiality and Privacy",
    paragraphs: [
      "Members may have access to personal or organisational information that is not intended for public distribution.",
      "Such information should not be:",
    ],
    bullets: [
      "Shared without authorisation",
      "Published publicly",
      "Sold",
      "Used for personal advantage",
      "Used to harass another person",
    ],
  },
  {
    number: "12A",
    title: "Respecting Privacy",
    paragraphs: [
      "Members should respect the privacy of other Realiseans and comply with RRI's Privacy Policy.",
    ],
  },
  {
    number: "13",
    title: "Safeguarding",
    paragraphs: [
      "RRI is committed to maintaining an environment where people, particularly children and vulnerable persons participating in appropriate programmes, are treated with dignity and protected from abuse and exploitation.",
      "Any allegation or reasonable concern involving:",
    ],
    bullets: [
      "Abuse",
      "Exploitation",
      "Sexual misconduct",
      "Serious threats",
      "Violence",
      "Harm to vulnerable persons",
    ],
  },
  {
    number: "13A",
    title: "Reporting Safeguarding Concerns",
    paragraphs: [
      "The above should be reported promptly through RRI's designated safeguarding channels.",
    ],
  },
  {
    number: "14",
    title: "Conflicts of Interest",
    paragraphs: [
      "RRI representatives should disclose situations where personal, financial, professional or family interests could improperly influence an organisational decision.",
      "A conflict of interest does not automatically mean wrongdoing.",
      "The important principle is:",
    ],
    quote:
      "Disclose it, manage it and prevent personal interests from improperly controlling organisational decisions.",
  },
  {
    number: "15",
    title: "Responsible Social Media Use",
    paragraphs: [
      "RRI members who use social media are encouraged to promote constructive dialogue and responsible communication.",
      "When discussing RRI publicly, members should:",
    ],
    bullets: [
      "Avoid deliberately spreading false information",
      "Respect privacy",
      "Avoid harassment",
      "Clearly distinguish personal opinions from official RRI positions",
      "Avoid unauthorised statements on behalf of RRI",
      "Protect confidential organisational information",
    ],
  },
  {
    number: "15A",
    title: "Official Accounts",
    paragraphs: [
      "Official RRI social-media accounts should be managed only by authorised personnel.",
    ],
  },
  {
    number: "16",
    title: "Intellectual Property",
    paragraphs: [
      "Members should respect the intellectual property of RRI and others.",
      "Do not:",
    ],
    bullets: [
      "Copy another person's work and claim it as your own",
      "Use copyrighted material unlawfully",
      "Misappropriate RRI's manuals, programmes or branding",
      "Reproduce restricted RRI materials without permission",
    ],
  },
  {
    number: "16A",
    title: "Acknowledging Sources",
    paragraphs: [
      "Where appropriate, acknowledge original creators and sources.",
    ],
  },
  {
    number: "17",
    title: "Responsible Leadership",
    paragraphs: [
      "RRI leadership is a responsibility, not a privilege for personal power.",
      "Leaders are expected to:",
    ],
    bullets: [
      "Lead by example",
      "Listen to members",
      "Avoid abuse of authority",
      "Treat people fairly",
      "Maintain appropriate boundaries",
      "Protect organisational resources",
      "Encourage participation",
      "Accept constructive criticism",
      "Be accountable for their decisions",
    ],
  },
  {
    number: "17A",
    title: "Accountability",
    paragraphs: [
      "No position within RRI places an individual above accountability.",
    ],
  },
  {
    number: "18",
    title: "Use of Artificial Intelligence and Digital Tools",
    paragraphs: [
      "Members creating content for RRI using artificial intelligence or other digital tools should use them responsibly.",
      "They should not knowingly use AI to:",
    ],
    bullets: [
      "Fabricate evidence",
      "Create deceptive information",
      "Impersonate people",
      "Produce fraudulent documents",
      "Manipulate individuals",
      "Misrepresent AI-generated material as verified research",
    ],
  },
  {
    number: "18A",
    title: "Verification",
    paragraphs: [
      "Important factual claims should be appropriately verified before being presented as fact.",
    ],
  },
  {
    number: "19",
    title: "Reporting Misconduct",
    paragraphs: [
      "Anyone who believes that this Code of Conduct has been violated should report the concern through the appropriate RRI reporting channel.",
      "Reports should be made honestly and in good faith.",
      "RRI will seek to handle legitimate reports fairly, responsibly and with appropriate confidentiality.",
      "False allegations deliberately made to harm another person may themselves constitute misconduct.",
    ],
  },
  {
    number: "20",
    title: "Disciplinary Action",
    paragraphs: [
      "Depending on the seriousness of the conduct, RRI may take appropriate action, including:",
    ],
    bullets: [
      "Informal guidance",
      "Warning",
      "Mediation",
      "Removal of content",
      "Temporary restriction",
      "Suspension",
      "Removal from a programme",
      "Removal from an organisational position",
      "Termination of membership",
      "Referral to appropriate authorities where required by law",
    ],
  },
  {
    number: "20A",
    title: "Proportionate Response",
    paragraphs: [
      "The response should be proportionate to the circumstances.",
    ],
  },
  {
    number: "21",
    title: "No Retaliation",
    paragraphs: [
      "RRI does not support retaliation against individuals who make a legitimate good-faith report of misconduct or participate honestly in an investigation.",
      "Retaliation may itself constitute a violation of this Code.",
    ],
  },
  {
    number: "22",
    title: "Accountability",
    paragraphs: [
      "Every person associated with RRI is responsible for understanding and respecting this Code.",
      "Leadership positions do not exempt anyone from these standards.",
      "In fact:",
    ],
    quote: "The greater the responsibility, the greater the expectation of integrity.",
  },
  {
    number: "23",
    title: "Continuous Review",
    paragraphs: [
      "This Code of Conduct may be reviewed and updated as RRI grows, develops new programmes and expands into different countries and communities.",
      "Updates will be communicated through appropriate organisational channels.",
    ],
  },
];

export default function CodeOfConductPage() {
  return (
    <LegalPage
      eyebrow="Code of Conduct"
      title="The standards that guide our community."
      effectiveDate="1 September 2026"
      lastUpdated="1 September 2026"
      intro={intro}
      sections={sections}
      closingTitle="Our Commitment"
      closingLines={[
        "Realise Reality Initiative is committed to creating a community where people can question without fear, disagree without hatred, learn without humiliation, lead without oppression and serve without discrimination.",
        "We may come from different nations, cultures and backgrounds. We may disagree about many things. But within RRI, we share a commitment to human dignity, intellectual honesty, continuous learning and the betterment of humanity.",
      ]}
      closingMotto="Think freely. Question honestly. Respect people. Seek understanding. Live consciously. Contribute meaningfully."
    />
  );
}
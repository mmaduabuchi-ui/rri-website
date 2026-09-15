import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Realise Reality Initiative",
  description:
    "Realise Reality Initiative Privacy Policy — how we collect, use, store, protect and manage personal information.",
  alternates: { canonical: "https://www.realise-reality.org/privacy-policy" },
};

const intro = [
  "Realise Reality Initiative (\"RRI,\" \"we,\" \"us,\" or \"our\") respects your privacy and is committed to protecting the personal information entrusted to us.",
  "This Privacy Policy explains how we collect, use, store, protect and manage personal information when you visit our website, register as an RRI member or volunteer, participate in our programmes, communicate with us, or otherwise interact with Realise Reality Initiative.",
  "By using our website or voluntarily providing your personal information, you acknowledge that you have read and understood this Privacy Policy.",
];

const sections: LegalSection[] = [
  {
    number: "1",
    title: "Who We Are",
    paragraphs: [
      "Realise Reality Initiative (RRI) is an international, non-profit, non-religious and non-political initiative committed to helping people see life through the lens of truth through critical thinking, practical life education, conscious living, human development and meaningful community participation.",
      "RRI seeks to build an inclusive global community where people can learn, question, connect and contribute to humanity without discrimination or coercion.",
    ],
    bullets: [
      "Registered/Administrative Location: 56 Ikot Offiong Ambai, Akpabuyo LGA, Cross River State, Nigeria — Africa",
      "Email: info@realise-reality.org",
      "Website: https://www.realise-reality.org",
    ],
  },
  {
    number: "2",
    title: "Information We Collect",
    paragraphs: ["Depending on how you interact with RRI, we may collect information such as:"],
  },
  {
    number: "2A",
    title: "Information You Provide",
    paragraphs: ["When you register or communicate with us, you may provide:"],
    bullets: [
      "Full name",
      "Preferred name",
      "Email address",
      "Telephone/WhatsApp number",
      "Country of residence",
      "State, province or region",
      "City or locality",
      "Age or date of birth where necessary",
      "Professional or educational information",
      "Skills and areas of interest",
      "Volunteer interests",
      "Membership information",
      "Responses to registration or application questions",
      "Information you voluntarily provide through messages, forms or correspondence",
    ],
  },
  {
    number: "2B",
    title: "Programme and Participation Information",
    paragraphs: ["We may collect information relating to your participation in:"],
    bullets: [
      "RRI programmes",
      "Training sessions",
      "Workshops",
      "Events",
      "Volunteer activities",
      "Community projects",
      "Leadership or coordination activities",
    ],
  },
  {
    number: "2C",
    title: "Technical Information",
    paragraphs: [
      "When you use our website, certain technical information may be collected automatically, including:",
    ],
    bullets: [
      "IP address",
      "Browser type",
      "Device type",
      "Operating system",
      "Website pages visited",
      "Date and time of visits",
      "Referring website",
      "Basic website usage information",
    ],
  },
  {
    number: "2D",
    title: "Purpose of Technical Information",
    paragraphs: [
      "We use technical information primarily to maintain, secure and improve our website.",
    ],
  },
  {
    number: "3",
    title: "How We Use Your Information",
    paragraphs: ["We may use personal information to:"],
    bullets: [
      "Process membership registrations",
      "Create and maintain member profiles",
      "Assign membership identification numbers",
      "Manage volunteers",
      "Communicate with members and volunteers",
      "Organise programmes and events",
      "Coordinate RRI activities across countries and communities",
      "Provide information about RRI activities",
      "Improve our programmes and services",
      "Conduct research and organisational planning",
      "Maintain administrative records",
      "Prevent fraud, abuse or misuse of our services",
      "Protect the security of our website and systems",
      "Meet applicable legal and regulatory requirements",
    ],
  },
  {
    number: "3A",
    title: "Purpose Limitation",
    paragraphs: [
      "We will not use your personal information for purposes that are materially incompatible with the purpose for which it was collected without an appropriate legal basis or, where required, your consent.",
    ],
  },
  {
    number: "4",
    title: "Membership Database",
    paragraphs: [
      "RRI may maintain a secure membership database containing information submitted by members and volunteers.",
      "This database helps us coordinate our international community and may allow authorised administrators to identify members according to relevant categories such as:",
    ],
    bullets: [
      "Country",
      "Region",
      "Chapter",
      "Volunteer status",
      "Skills",
      "Areas of interest",
      "Organisational role",
    ],
  },
  {
    number: "4A",
    title: "Database Access",
    paragraphs: [
      "Access to member information will be restricted to authorised persons who require the information to perform legitimate organisational responsibilities.",
      "RRI will not sell its membership database or personal information to third parties.",
    ],
  },
  {
    number: "5",
    title: "Public Profiles",
    paragraphs: [
      "Some RRI members, volunteers, coordinators or executives may choose to have a profile published on the RRI website.",
      "A public profile may contain information such as:",
    ],
    bullets: [
      "Name",
      "Photograph",
      "Country",
      "Organisational role",
      "Professional background",
      "Skills",
      "Biography",
      "Areas of contribution",
    ],
  },
  {
    number: "5A",
    title: "Consent and Removal",
    paragraphs: [
      "We will seek appropriate permission before publishing personal information that is intended to identify an individual publicly.",
      "Members may request correction or removal of their public profile by contacting RRI.",
    ],
  },
  {
    number: "6",
    title: "Information Sharing",
    paragraphs: [
      "RRI does not sell, rent or trade personal information.",
      "We may share limited information where reasonably necessary with:",
    ],
    bullets: [
      "Authorised RRI officers and administrators",
      "Service providers supporting our website or database",
      "Technology and hosting providers",
      "Programme partners where necessary for a legitimate programme purpose",
      "Professional advisers where necessary",
      "Government authorities or law-enforcement bodies where legally required",
    ],
  },
  {
    number: "6A",
    title: "Third-Party Obligations",
    paragraphs: [
      "Where third-party service providers process information on our behalf, we will seek to ensure that appropriate confidentiality and security obligations apply.",
    ],
  },
  {
    number: "7",
    title: "International Data Transfers",
    paragraphs: [
      "RRI is intended to operate internationally.",
      "Your personal information may therefore be accessed or processed by authorised RRI personnel or service providers located in countries other than your country of residence.",
      "Where applicable, RRI will take reasonable steps to ensure that international transfers are handled in accordance with applicable data-protection requirements.",
    ],
  },
  {
    number: "8",
    title: "Data Security",
    paragraphs: [
      "We take reasonable administrative, technical and organisational measures to protect personal information against:",
    ],
    bullets: [
      "Unauthorised access",
      "Loss",
      "Misuse",
      "Alteration",
      "Disclosure",
      "Destruction",
    ],
  },
  {
    number: "8A",
    title: "Limits of Security",
    paragraphs: [
      "However, no internet-based system can be guaranteed to be completely secure.",
      "Members should therefore avoid submitting highly sensitive information through ordinary website forms unless specifically requested through an appropriate secure process.",
    ],
  },
  {
    number: "9",
    title: "Data Retention",
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including legitimate organisational, administrative, legal and reporting requirements.",
      "When information is no longer reasonably required, we may securely delete, anonymise or otherwise dispose of it.",
    ],
  },
  {
    number: "10",
    title: "Your Privacy Rights",
    paragraphs: [
      "Depending on your country and applicable law, you may have rights relating to your personal information, including the right to:",
    ],
    bullets: [
      "Request access to information we hold about you",
      "Request correction of inaccurate information",
      "Request deletion of information where appropriate",
      "Withdraw consent where processing is based on consent",
      "Object to certain processing activities",
      "Request restriction of processing in applicable circumstances",
      "Request information about how your data is being used",
      "Lodge a complaint with the relevant data-protection authority",
    ],
  },
  {
    number: "10A",
    title: "Exercising Your Rights",
    paragraphs: [
      "To exercise a privacy right, contact us using the details provided below.",
    ],
  },
  {
    number: "11",
    title: "Children and Minors",
    paragraphs: [
      "RRI may undertake programmes involving young people or children.",
      "Where our activities involve children or persons below the applicable age of digital or legal consent, we will implement appropriate safeguarding and consent procedures.",
      "We do not knowingly collect unnecessary personal information from children through our website.",
      "Where parental or guardian consent is legally required, we will seek it before collecting or publishing relevant personal information.",
    ],
  },
  {
    number: "12",
    title: "Cookies",
    paragraphs: [
      "Our website may use cookies or similar technologies to:",
    ],
    bullets: [
      "Keep the website functioning properly",
      "Understand website usage",
      "Improve user experience",
      "Maintain security",
      "Analyse website performance",
    ],
  },
  {
    number: "12A",
    title: "Cookie Controls",
    paragraphs: [
      "Where required by applicable law, we will provide appropriate cookie controls and obtain consent for non-essential cookies.",
    ],
  },
  {
    number: "13",
    title: "Third-Party Websites",
    paragraphs: [
      "Our website may contain links to external websites, social-media platforms, registration systems or other third-party services.",
      "RRI is not responsible for the privacy practices, security or content of third-party websites.",
      "We encourage users to review the privacy policies of any external service before providing personal information.",
    ],
  },
  {
    number: "14",
    title: "Photographs, Video and Events",
    paragraphs: [
      "RRI may document its programmes and events through photographs, videos or other media.",
      "Where an individual's identifiable image or personal information is intended for public use, RRI will seek appropriate permission or rely on another lawful basis where applicable.",
      "If you appear in RRI media and have a legitimate concern about its use, you may contact us.",
    ],
  },
  {
    number: "15",
    title: "Voluntary Information",
    paragraphs: [
      "You are generally free to decide whether to provide personal information.",
      "However, certain information may be necessary to:",
    ],
    bullets: [
      "Register for membership",
      "Participate in specific programmes",
      "Volunteer",
      "Receive certain services",
      "Perform organisational responsibilities",
    ],
  },
  {
    number: "15A",
    title: "Explaining Requirements",
    paragraphs: [
      "Where information is required, we will endeavour to explain why it is necessary.",
    ],
  },
  {
    number: "16",
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "RRI may periodically update this Privacy Policy to reflect changes in our activities, technology, legal requirements or data-protection practices.",
      "The updated version will be published on this page with a revised \"Last Updated\" date.",
      "We encourage users to periodically review this Privacy Policy.",
    ],
  },
  {
    number: "17",
    title: "Contact Us",
    paragraphs: [
      "If you have questions, concerns or requests regarding this Privacy Policy or the way RRI handles personal information, please contact:",
    ],
    bullets: [
      "Realise Reality Initiative",
      "Email: info@realise-reality.org",
      "Website: https://www.realise-reality.org",
      "Address: 56 Ikot Offiong Ambai, Akpabuyo LGA, Cross River State, Nigeria — Africa",
      "Subject: Privacy/Data Protection Request",
    ],
  },
  {
    number: "17A",
    title: "Response Time",
    paragraphs: [
      "We will make reasonable efforts to respond to legitimate privacy requests within an appropriate timeframe.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="How we protect and manage your information."
      effectiveDate="1 September 2026"
      lastUpdated="1 September 2026"
      intro={intro}
      sections={sections}
      closingTitle="Our Privacy Commitment"
      closingLines={[
        "Your information belongs to you.",
        "Realise Reality Initiative is committed to treating personal information with respect, protecting it responsibly, and using it only for legitimate purposes connected to our mission and organisational activities.",
      ]}
      closingMotto="Helping you see life through the lens of truth."
    />
  );
}
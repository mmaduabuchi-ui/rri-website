import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/pages/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Our Team | Realise Reality Initiative",
  description:
    "Meet the leadership structure and team behind Realise Reality Initiative. Committed to integrity, accountability, and meaningful impact.",
  keywords: "RRI team, leadership, executive directors, non-profit leadership",
};

type LeadershipMember = {
  role: string;
  name: string;
  title?: string;
  image: string;
  bio: string[];
  motto?: string;
};

const leadership: LeadershipMember[] = [
  {
    role: "President",
    name: "Ekpo (Collins) Bassey",
    title:
      "Writer | Creative Professional | Graphics Designer | Video Editor | Instructor | Life Coach | Community Development Advocate",
    image: "/images/photo_2026-08-31_19-17-48.jpg",
    bio: [
      "Ekpo (Collins) Bassey is a writer, creative professional, graphics designer, video editor, instructor, life coach, and community development advocate. He is deeply passionate about human development, critical thinking, creativity, education, storytelling, and the pursuit of truth.",
      "Collins is the founder and CEO of Strict Multi-Service Hub, through which he has trained and empowered more than 16,000 people in various skills and areas of personal and digital development.",
      "As an author, Collins has written several books, including The Human Manual and My Journey to the Tiger's Cage, alongside numerous articles and thought-provoking publications shared on Facebook and other platforms. He also has several other books currently in development and awaiting official release.",
      "For Collins, writing is more than putting words on paper. It is about giving experiences a voice, turning pain into lessons, challenging assumptions, and preserving stories that deserve to be heard.",
    ],
  },
  {
    role: "Vice President",
    name: "Greg Jackson",
    title: "Spiritual Educator | Former U.S. Marine",
    image: "/images/photo_2026-08-31_19-39-06.jpg",
    bio: [
      "Greg Jackson is a spiritual educator dedicated to exploring truth beyond religious dogma. His work challenges institutional belief systems and encourages individuals to reconnect with their innate wholeness, emphasizing unity, self-awareness, and unconditional love.",
      "Born in St. Louis, Missouri, and currently based in Atlanta, Georgia, Greg is a former United States Marine. His teachings focus on breaking down ideological divisions and inspiring a deeper understanding of human connection.",
    ],
  },
  {
    role: "Secretary General",
    name: "Dr. Kayode Adebayo",
    title: "Realist | Writer | Public Speaker | Philosophy Student",
    image: "/images/photo_2026-08-31_19-34-15.jpg",
    bio: [
      "Dr. Kayode Adebayo is a realist, writer, public speaker on positive and healthy lifestyle, and seasoned philosophy student who likes to blend raw honesty with practical, applicable logic.",
      "His hobbies include gaming, reading, photography, and fitness. He loves animals and likes to travel and explore.",
    ],
    motto:
      "Don't depend on a God for something other men achieved without a God.",
  },
  {
    role: "Director of Welfare and Human Support",
    name: "Hazel Campbell",
    title: "Humanitarian Advocate | Caregiver | Community Supporter",
    image: "/images/photo_2026-08-31_18-46-46.jpg",
    bio: [
      "Hazel Campbell is a dedicated humanitarian and caregiver from Jamaica, with a strong passion for service and community development. She currently works as a Home Health Aide in the United States of America, where she provides compassionate care and support to individuals in need, demonstrating empathy, responsibility, and commitment in her daily work.",
      "She is a proud mother of four and brings a deep sense of purpose and nurturing into both her personal and professional life.",
      "Hazel has a creative and reflective personality, with interests in handcraft, needlepoint, and reading. She also enjoys music, particularly reggae and soul, which connect her to culture and expression.",
      "Her core interest lies in humanitarian work, with a special focus on supporting children in orphanages. She is driven by a desire to contribute meaningfully to the well-being and development of vulnerable children.",
      "Hazel values healthy living and maintains a strong connection with nature, which she considers an essential part of her lifestyle and personal balance.",
      "Her long-term vision is to contribute to the growth and rise of Africa, reflecting her global outlook and commitment to collective human progress.",
    ],
    motto: "Anything is possible with a positive mindset.",
  },
  {
    role: "Director of Programs and Outreaches",
    name: "Benjamin Sesay",
    title: "Tailor | Medical Student | Self-Mastery Educator",
    image: "/images/photo_2026-08-31_20-16-16.jpg",
    bio: [
      "Benjamin Sesay is a Sierra Leonean tailor, medical student, and advocate for personal awakening and self-mastery. Born and raised in Bo District, Sierra Leone.",
      "Beyond his academic and professional pursuits, Benjamin is passionate about helping people discover their inner potential and develop greater awareness of themselves. Through one-on-one conversations, social media engagement, and mentorship, he encourages individuals to question limiting beliefs and become more conscious of the power and possibilities within themselves.",
      "He also mentors aspiring tailors, helping interested individuals develop practical tailoring skills and pursue self-reliance through entrepreneurship.",
    ],
    motto: "Awaken the mind, discover the self, and become who you truly are.",
  },
  {
    role: "Director of Partnerships",
    name: "Doreen Chikonde Mwelwa (Akula TaMa BaNiNi)",
    title: "Author | Researcher | Advocate for Inner Healing & Conscious Living",
    image: "/images/photo_2026-08-31_19-29-50.jpg",
    bio: [
      "Doreen Chikonde Mwelwa (Akula TaMa BaNiNi) is an author, researcher, and advocate for inner healing, self-awareness, and conscious living. Her work explores the ways emotional patterns, inherited beliefs, personal experiences, and social conditioning shape how people see themselves and the world around them.",
      "She is the author of The Inner Healing Codex, a transformative guide that encourages readers to examine the emotional patterns they carry, release inherited pain, and reconnect with the authentic self beneath layers of conditioning.",
      "Her approach brings together personal reflection, critical thinking, emotional awareness, and practical self-discovery. Rather than presenting healing as becoming someone new, Akula invites people to understand themselves more deeply and recognize the patterns that may be influencing their choices, relationships, identity, and perception of reality.",
      "With a deep interest in African history, culture, human behavior, spirituality, consciousness, and personal development, she encourages open inquiry and the courage to question inherited narratives while remaining willing to examine one's own beliefs.",
      "Through her writing, discussions, and teaching, Akula seeks to create spaces where people can question, reflect, heal, and ultimately live with greater awareness, clarity, and personal responsibility.",
    ],
    motto: "Healing begins when we become willing to see ourselves clearly.",
  },
  {
    role: "Director of Communications and Media",
    name: "Mmaduabuchi Ogu",
    title:
      "AI/ML Specialist | Full-Stack Web Developer | Solar Installation Engineer | Educator",
    image: "/images/photo_2026-08-31_19-45-11.jpg",
    bio: [
      "Mmaduabuchi Ogu is a technology professional with a background in Science Laboratory Technology (Biochemistry) and a Postgraduate Diploma in Education (PGDE). Driven by a passion for innovation, technology, and problem-solving, he transitioned into the technology industry, where he has developed expertise in Artificial Intelligence and Machine Learning, with a specialization in Natural Language Processing (NLP).",
      "He is also a Full-Stack Web Developer with experience in designing and developing modern, responsive web applications. In addition, Mmaduabuchi is a professional Solar Installation Engineer with expertise in solar power system design, installation, and maintenance.",
      "Passionate about leveraging technology to create impactful solutions, he is committed to facilitating meaningful discussions, solving real-world problems, and contributing to projects that drive positive change in society.",
    ],
  },
  {
    role: "Director of Research and Education",
    name: "Son Agapian",
    title: "Reflective Writer | Speaker | Creator of 'Poke Now'",
    image: "/images/photo_2026-08-31_19-55-18.jpg",
    bio: [
      "Son Agapian is a reflective writer, speaker, and the voice behind 'Poke Now,' a platform for honest conversations about life, awareness, and the human experience.",
      "His work is not about teaching people how to live but about creating space for reflection, curiosity, and direct observation. Through his writings and conversations, he invites people to question inherited assumptions and reconnect with what is already evident in everyday life.",
      "At the heart of Poke Now is a simple expression: 'Talking to myself. Saying what you already know.' Through this approach, Son explores themes such as love, relationships, parenting, identity, responsibility, and conscious living with warmth, clarity, and authenticity.",
      "He is also the author of several thought-provoking works, including From Shadow to Spirit, Breaking Through False Thinking Phrases, You Are Before Belief, The End of a GOD, No Other Name, Before Meaning, Two Humans, Not Two Roles, and lots more, all of which invite readers to move beyond inherited narratives and discover what remains when they observe life directly.",
      "His hope is simple: not to provide answers, but to encourage deeper seeing and more meaningful conversations about what it means to be human.",
    ],
  },
  {
    role: "Director of Community and International Development",
    name: "Eniyebo Ekpedekumor Francis",
    title: "Marine Consultant | Oil & Gas Professional | Marine Equipment Specialist",
    image: "/images/photo_2026-08-31_20-04-09.jpg",
    bio: [
      "Eniyebo Ekpedekumor Francis is a marine consultant with a background in oil and gas. He transitioned into the marine industry, where he has expertise in marine machinery with a specialization in repairs of marine equipment and maintenance.",
      "He is also a vendor to NIPEX, a subsidiary of NNPC.",
      "Passionate about leveraging the marine sector to create impactful solutions, he is committed to facilitating meaningful discussions, solving real-world problems in the marine world.",
    ],
  },
  {
    role: "Director of Digital Communications and Social Media",
    name: "Brian Waters",
    title: "Global Sports Professional | Social Media & E-Commerce Educator | Entrepreneur",
    image: "/images/photo_2026-08-31_20-09-21.jpg",
    bio: [
      "Brian Waters is a Chapel Hill, North Carolina native and Elon University Sports Management graduate who transitioned a 2009 professional basketball career into a global mission spanning 30 countries. After playing and coaching across China, Hong Kong, Australia, Saudi Arabia, Thailand, Taiwan, Canada, and Uganda, he ultimately settled in East Africa. Across eight years living in Kenya, Tanzania, Rwanda, and Uganda, he has dedicated himself to empowering African youth and students through social media and e-commerce education, using the real-world insights from his travels to bridge the gaps left by traditional curriculums.",
      "His hands-on impact spans multiple impactful ventures, including StockWave, an e-commerce platform that teaches local students how to sell globally via WeChat and Instagram, and Open House Africa, which showcases universities to the diaspora. He also founded Myaah.com—dubbed 'the Zillow of Africa'—to cover real estate across all 54 countries, alongside Agriscell, a media platform tackling food security and commodities trading. From fashion to farming, Waters' work centers on giving back, educating communities on overlooked issues, and creating opportunity where it is needed most.",
    ],
  },
];

export default function TeamPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Team"
        title="People committed to advancing the vision."
        description="Our leadership structure brings together individuals committed to integrity, accountability, collaboration, and meaningful impact."
      />

      {/* Leadership Profiles */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Leadership
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
              A structure built for responsible leadership.
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
              Our executive structure is designed to support effective
              leadership, program delivery, communication, partnerships, and
              organizational accountability.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl space-y-12">
            {leadership.map((member) => (
              <article
                key={member.role}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[220px_1fr] lg:gap-10">
                  {/* Photo */}
                  <div className="mx-auto w-40 lg:w-full">
                    <div className="relative aspect-square w-40 overflow-hidden rounded-2xl lg:w-full">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1B3D] sm:text-2xl">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#1E824C]">
                      {member.role}
                    </p>

                    {member.title && (
                      <p className="mt-1 text-sm text-gray-500">
                        {member.title}
                      </p>
                    )}

                    <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                      {member.bio.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>

                    {member.motto && (
                      <div className="mt-6 border-l-4 border-[#F7B500] pl-5">
                        <p className="italic font-semibold text-[#0B1B3D]">
                          &ldquo;{member.motto}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Commitment */}
      <section className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
              Our Commitment
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#0B1B3D] sm:text-4xl">
              Leadership with integrity and accountability.
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
              Our team operates with integrity, accountability, and a shared
              commitment to the mission of Realise Reality Initiative.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
              As the organization grows, our leadership structure will continue
              to evolve to support responsible governance, effective
              collaboration, and measurable impact.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
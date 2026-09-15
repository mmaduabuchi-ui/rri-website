import Hero from "@/components/home/Hero";
import VideoLogo from "@/components/home/VideoLogo";
import Introduction from "@/components/home/Introduction";
import AboutSection from "@/components/home/AboutSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import TeamSection from "@/components/home/TeamSection";
import KnowledgeTeaser from "@/components/home/KnowledgeTeaser";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <VideoLogo />
      <Introduction />
      <AboutSection />
      <ProgramsSection />
      <TeamSection />
      <KnowledgeTeaser />
      <CTA />
    </main>
  );
}
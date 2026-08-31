import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import WhatWeDo from "@/components/home/WhatWeDo";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Introduction />
      <WhatWeDo />
      <CTA />
    </main>
  );
}
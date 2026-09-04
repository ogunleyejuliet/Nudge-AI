import { Audience } from "@/components/landing/Audience";
import { DiscoveryPreview } from "@/components/landing/DiscoveryPreview";
import { Evidence } from "@/components/landing/Evidence";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { ProblemFirst } from "@/components/landing/ProblemFirst";
import { ProblemToProduct } from "@/components/landing/ProblemToProduct";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ProblemFirst />
        <DiscoveryPreview />
        <ProblemToProduct />
        <Audience />
        <Features />
        <Evidence />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import TechStack from "@/components/TechStack";
import GitHubContributions from "@/components/GitHubContributions";
import ConnectSection from "@/components/ConnectSection";
import BookCallSection from "@/components/BookCallSection";
import Guestbook from "@/components/Guestbook";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingMascot from "@/components/FloatingMascot";
import IntroAnimation from "@/components/IntroAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import CursorTrail from "@/components/CursorTrail";
import StatCounter from "@/components/StatCounter";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && <IntroAnimation onComplete={() => setIntroComplete(true)} />}
      <div className="min-h-screen bg-background bg-grid relative">
        <ParticleBackground />
        <CursorTrail />
        <div className="relative z-10">
          <FloatingMascot />
          <Navbar />
          <HeroSection />
          <BioSection />
          <StatCounter />
          <ExperienceSection />
          <AchievementsSection />
          <TechStack />
          <GitHubContributions />
          <ConnectSection />
          <BookCallSection />
          <Guestbook />
          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </>
  );
};

export default Index;

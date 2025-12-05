import React from "react";
import { HeroSection } from "../components/hero-section-1";
import Partners from "../components/home/Partners";
import Vision from "../components/home/Vision";
import Features from "../components/home/Features";
import PlatformStrengths from "../components/home/PlatformStrengths";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      {/* <Partners /> */}
      <Vision />
      <Features />
      {/* <PlatformStrengths /> */}
      <CTA />
    </div>
  );
};

export default Home;

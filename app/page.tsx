"use client";
import Header from "../components/Header";
import HeroSection from "../components/home/HeroSection";
import EcoTips from "../components/home/EcoTips";
import StatsSection from "../components/home/StatsSection";
import CommunitySection from "../components/home/CommunitySection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-50">
      <Header />

      <main className="flex-1 flex flex-col gap-20 px-6 md:px-16 lg:px-40 py-10">
        <HeroSection />
        <EcoTips />
        <StatsSection />
        <CommunitySection />
      </main>

      <Footer />
    </div>
  );
}

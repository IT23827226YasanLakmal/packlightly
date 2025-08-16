// pages/index.tsx
import Header from "../components/Header";
import HeroSection from "../components/home/HeroSection";
import EcoTips from "../components/home/EcoTips";
import CommunitySection from "../components/home/CommunitySection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbf9]">
      <Header />

      <main className="px-6 md:px-16 lg:px-40 flex flex-1 justify-center py-10">
        <div className="max-w-5xl flex-1 flex flex-col gap-10">
          <HeroSection />
          <EcoTips />
          <CommunitySection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

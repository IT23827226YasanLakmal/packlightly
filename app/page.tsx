import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import EcoTips from "../components/home/EcoTips";
import CommunitySection from "../components/home/CommunitySection";
import Footer from "../components/home/Footer";

export default function HomePage() {
  return (
    <div className="layout-container flex flex-col min-h-screen">
      <Header />
      <main className="px-40 flex flex-1 justify-center py-5">
        <div className="max-w-[960px] flex-1 flex flex-col">
          <HeroSection />
          <EcoTips />
          <CommunitySection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

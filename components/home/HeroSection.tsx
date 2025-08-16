'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseClient';

export default function HeroSection() {
  const router = useRouter();

  const handleStartPacking = () => {
    const user = auth.currentUser;
    if (user) {
      router.push('/dashboard/trips');
    } else {
      router.push('/login');
    }
  };

  return (
    <section className="relative w-full min-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-xl"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC3RSnWYgNhWorocS8eAd8h46L1worM_mmzm3CeUmOgZId8S4cLB7SXQLN7uNkkOca613F36CuQDPDYfHJtxbggmbWYFBaXxoi1E5kR70AlxR2EsBVb5wMCYVdAYZPuqQlpqvFa4mIH1ZFyNHCkqtHlk56hkWSZzunf0l4l35RwJyCEBYWnzEBNG4k_0J6yNT8_xKY-dzLaFZhZ6R9j6uN1MTCJDhLdy6qLkIlg2tfelX5j7SdDaCn51VHZYT4oMd1O-JgDhl_6fhN")',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div> {/* Overlay */}
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-400/30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-green-300/25 animate-bounce-slow"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-6">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Pack Smart. Travel Green.
        </h1>
        <p className="text-white text-sm md:text-base max-w-lg drop-shadow-md">
          Your intelligent packing assistant for eco-conscious journeys.
        </p>
        <button
          onClick={handleStartPacking}
          className="mt-4 px-6 py-3 rounded-xl bg-green-400 text-white font-bold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transform transition duration-300"
        >
          Start Packing
        </button>
      </div>
    </section>
  );
}

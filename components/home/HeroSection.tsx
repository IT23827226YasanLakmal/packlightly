export default function HeroSection() {
  return (
    <section className="@container p-4">
      <div
        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC3RSnWYgNhWorocS8eAd8h46L1worM_mmzm3CeUmOgZId8S4cLB7SXQLN7uNkkOca613F36CuQDPDYfHJtxbggmbWYFBaXxoi1E5kR70AlxR2EsBVb5wMCYVdAYZPuqQlpqvFa4mIH1ZFyNHCkqtHlk56hkWSZzunf0l4l35RwJyCEBYWnzEBNG4k_0J6yNT8_xKY-dzLaFZhZ6R9j6uN1MTCJDhLdy6qLkIlg2tfelX5j7SdDaCn51VHZYT4oMd1O-JgDhl_6fhN")',
        }}
      >
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-white text-4xl font-black tracking-[-0.033em] @[480px]:text-5xl">
            Pack Smart. Travel Green.
          </h1>
          <h2 className="text-white text-sm @[480px]:text-base">
            Your intelligent packing assistant for eco-conscious journeys.
          </h2>
        </div>
        <button className="flex min-w-[84px] h-10 px-4 @[480px]:h-12 @[480px]:px-5 rounded-xl bg-[#19e56b] text-sm font-bold tracking-[0.015em]">
          Start Packing
        </button>
      </div>
    </section>
  );
}

// pages/about.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-6 md:px-20 lg:px-40 py-16 bg-gray-50">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            About PackLight
          </h1>
          <p className="text-gray-600 text-lg">
            PackLight is your intelligent packing assistant, helping eco-conscious travelers plan smarter, pack lighter, and explore the world sustainably.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600">
              We aim to reduce travel waste by providing practical tools and tips to pack efficiently, choose eco-friendly products, and support sustainable travel habits.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            alt="Sustainable travel"
            className="rounded-xl shadow-lg w-full h-full object-cover"
          />
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            alt="Team working"
            className="rounded-xl shadow-lg w-full h-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600">
              We envision a world where travelers are mindful of their footprint, embracing sustainability while exploring new destinations. PackLight empowers every traveler to make eco-friendly choices.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Sophia Carter", role: "Founder & Designer", image: "https://randomuser.me/api/portraits/women/68.jpg" },
              { name: "Yasan Lakmal", role: "Lead Developer", image: "https://randomuser.me/api/portraits/men/65.jpg" },
              { name: "Olivia Bennett", role: "Community Manager", image: "https://randomuser.me/api/portraits/women/65.jpg" },
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full w-24 h-24 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

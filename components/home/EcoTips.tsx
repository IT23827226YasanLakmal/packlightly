"use client";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react"; // Tailwind friendly icon

const tips = [
  { title: "Pack light & reusable items", description: "Bring reusable bottles and bags for sustainable travel." },
  { title: "Use public transport", description: "Reduce your carbon footprint by using buses or trains." },
  { title: "Support eco hotels", description: "Choose accommodations with green certifications." },
  { title: "Respect nature", description: "Avoid littering and stay on designated paths." },
];

export default function EcoTips() {
  return (
    <section className="flex flex-col items-center text-center gap-8">
      <h2 className="text-3xl font-bold text-emerald-900">🌱 Eco Travel Tips</h2>
      <p className="text-green-700 max-w-xl">Small actions make a big impact! Follow these tips to travel sustainably.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {tips.map((tip, idx) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col gap-4"
          >
            <Leaf className="w-8 h-8 text-green-500" />
            <h3 className="text-lg font-semibold text-emerald-900">{tip.title}</h3>
            <p className="text-green-700 text-sm">{tip.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

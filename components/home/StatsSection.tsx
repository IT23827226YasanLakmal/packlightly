"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const statsData = [
  { label: "CO₂ Saved (tons)", value: 1280, color: "#34D399" },
  { label: "Trees Planted", value: 430, color: "#10B981" },
  { label: "Eco Travelers Joined", value: 980, color: "#059669" },
  { label: "Plastic Saved (kg)", value: 1520, color: "#047857" },
];

export default function StatsSection() {
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((c, i) => {
          if (c < statsData[i].value) return Math.min(c + Math.ceil(statsData[i].value / 60), statsData[i].value);
          return c;
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 flex flex-col items-center text-center bg-gradient-to-b from-green-50 via-green-100 to-green-50">
      <h2 className="text-3xl font-bold text-emerald-900 mb-4">🌿 Our Sustainability Impact</h2>
      <p className="text-green-700 mb-12 max-w-xl">See how our eco-conscious travelers and initiatives make a global difference.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 max-w-5xl w-full">
        {statsData.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-24 h-24">
              <CircularProgressbar
                value={(counts[idx] / stat.value) * 100}
                text={`${counts[idx]}`}
                strokeWidth={8}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: stat.color,
                  textColor: "#065F46",
                  trailColor: "#D1FAE5",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
            <p className="text-green-800 font-semibold text-sm sm:text-base">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { category: "Bottles", ecoScore: 5 },
  { category: "Clothing", ecoScore: 3.5 },
  { category: "Bags", ecoScore: 4 },
  { category: "Utensils", ecoScore: 4.5 },
  { category: "Toiletries", ecoScore: 3 },
  { category: "Accessories", ecoScore: 4.2 },
];

export default function CategoryRadarChart() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-black to-emerald-950   
      backdrop-blur-xl border border-green-700/40 shadow-lg shadow-emerald-900/40 p-6 h-96">

      <h2 className="text-lg font-semibold text-white mb-2">
        🔄 Category Eco Score Radar
      </h2>
      <p className="text-xs text-green-300 mb-4">
        Compare sustainability strength across product categories
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis dataKey="category" stroke="#a7f3d0" />
          <PolarRadiusAxis
            domain={[0, 5]}
            stroke="#6ee7b7"
            tick={{ fill: "#d1fae5", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: "10px",
              border: "1px solid rgba(16,185,129,0.5)",
              color: "#fff",
              fontSize: "0.85rem",
            }}
          />
          <Radar
            name="Eco Score"
            dataKey="ecoScore"
            stroke="#34d399"
            fill="#10b981"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

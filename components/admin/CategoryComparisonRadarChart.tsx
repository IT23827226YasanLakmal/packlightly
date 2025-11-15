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

interface CategoryRadarChartProps {
  data: Array<{ category: string; ecoScore: number }>;
  loading: boolean;
}

export default function CategoryRadarChart({ data, loading }: CategoryRadarChartProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-black to-emerald-950   
      backdrop-blur-xl border border-green-700/40 shadow-lg shadow-emerald-900/40 p-6 h-96">

      <h2 className="text-lg font-semibold text-white mb-2">
        🔄 Category Eco Score Radar
      </h2>
      <p className="text-xs text-green-300 mb-4">
        {loading 
          ? "Loading category data..." 
          : `Compare sustainability across ${data.length} product categories`
        }
      </p>

      <ResponsiveContainer width="100%" height="80%">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-green-300 text-sm">Loading chart data...</div>
          </div>
        ) : data.length === 0 || data[0].category === "No Data" ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-green-300 text-sm">No product data available</div>
          </div>
        ) : (
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
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SustainabilityIndexChartProps {
  data: Array<{ month: string; products: number }>;
  loading: boolean;
}

export default function SustainabilityIndexChart({ data, loading }: SustainabilityIndexChartProps) {
  // Use the provided data directly
  const sustainabilityData = data.length > 0 ? data : [
    { month: "Jan", products: 0 },
    { month: "Feb", products: 0 },
    { month: "Mar", products: 0 },
    { month: "Apr", products: 0 },
    { month: "May", products: 0 },
    { month: "Jun", products: 0 },
    { month: "Jul", products: 0 },
  ];
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-black to-emerald-950  
      backdrop-blur-xl border border-green-700/40 shadow-lg shadow-emerald-900/40 p-5">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Sustainability Index</h2>
        <p className="text-xs text-green-300">
          {loading ? "Loading..." : `Growth of eco products over time (${data.reduce((sum, item) => sum + item.products, 0)} total products)`}
        </p>
      </div>

      {/* Line Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-green-300 text-sm">Loading chart data...</div>
            </div>
          ) : (
            <LineChart data={sustainabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.2)" />
              <XAxis dataKey="month" stroke="#6ee7b7" tick={{ fill: "#6ee7b7", fontSize: 12 }} />
              <YAxis stroke="#6ee7b7" tick={{ fill: "#6ee7b7", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
                cursor={{ stroke: "rgba(16, 185, 129, 0.4)", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

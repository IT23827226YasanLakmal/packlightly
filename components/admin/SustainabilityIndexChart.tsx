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

// Example sustainability index data (number of eco products over months)
const sustainabilityData = [
  { month: "Jan", products: 12 },
  { month: "Feb", products: 18 },
  { month: "Mar", products: 25 },
  { month: "Apr", products: 32 },
  { month: "May", products: 40 },
  { month: "Jun", products: 46 },
  { month: "Jul", products: 55 },
];

export default function SustainabilityIndexChart() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-black to-emerald-950  
      backdrop-blur-xl border border-green-700/40 shadow-lg shadow-emerald-900/40 p-5">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Sustainability Index</h2>
        <p className="text-xs text-green-300">Growth of eco products over time</p>
      </div>

      {/* Line Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
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
              stroke="url(#colorGreen)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#064e3b" }}
              activeDot={{ r: 6, fill: "#34d399" }}
            />
            {/* Gradient stroke for the line */}
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

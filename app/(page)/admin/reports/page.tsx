"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, BarChart as BarIcon, PieChart as PieIcon, Users } from "lucide-react";

const COLORS = ["#34D399", "#10B981", "#059669", "#047857", "#065F46"];
const HOVER_COLORS = ["#6EE7B7", "#34D399", "#2DD4BF", "#22C55E", "#10B981"];

export default function ReportsPage() {
  const [userActivityData, setUserActivityData] = useState([]);
  const [ecoImpactData, setEcoImpactData] = useState([]);
  const [topItemsData, setTopItemsData] = useState([]);

  const [activeBarIndex, setActiveBarIndex] = useState(null);
  const [activeTopItemIndex, setActiveTopItemIndex] = useState(null);
  const [activePieIndex, setActivePieIndex] = useState(null);

  useEffect(() => {
    setUserActivityData([
      { name: "Jan", Users: 45 },
      { name: "Feb", Users: 60 },
      { name: "Mar", Users: 75 },
      { name: "Apr", Users: 50 },
      { name: "May", Users: 90 },
    ]);

    setEcoImpactData([
      { name: "CO₂ Saved", value: 400 },
      { name: "Plastic Avoided", value: 300 },
      { name: "Reusable Items", value: 300 },
      { name: "Waste Reduced", value: 200 },
    ]);

    setTopItemsData([
      { name: "Reusable Bottle", value: 120 },
      { name: "Travel Mug", value: 90 },
      { name: "Solar Charger", value: 80 },
      { name: "Eco Backpack", value: 70 },
      { name: "Bamboo Toothbrush", value: 60 },
    ]);
  }, []);

  const tooltipStyle = {
    backgroundColor: "#111",
    borderRadius: "8px",
    border: "1px solid #34D399",
    color: "#fff",
    fontSize: "13px",
  };

  const legendStyle = {
    color: "#34D399",
    fontSize: "14px",
  };

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Reports Dashboard</h1>
            <p className="text-green-300 text-sm">Insights on user activity & eco impact</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition">
          <Download size={18} /> Export All
        </button>
      </motion.div>

      {/* User Activity */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">User Activity</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={userActivityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            style={{ backgroundColor: "transparent" }}
          >
            <XAxis dataKey="name" stroke="#10B981" />
            <YAxis stroke="#10B981" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar
              dataKey="Users"
              radius={[5, 5, 0, 0]}
              onMouseEnter={(_, index) => setActiveBarIndex(index)}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              {userActivityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeBarIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Eco Impact */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Eco Impact</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart style={{ backgroundColor: "transparent" }}>
            <Pie
              data={ecoImpactData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              onMouseEnter={(_, index) => setActivePieIndex(index)}
              onMouseLeave={() => setActivePieIndex(null)}
              label={{ fill: "#fff" }}
            >
              {ecoImpactData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activePieIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Packed Items */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Top Packed Items</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={topItemsData}
            layout="vertical"
            margin={{ left: 50 }}
            style={{ backgroundColor: "transparent" }}
          >
            <XAxis type="number" stroke="#10B981" />
            <YAxis dataKey="name" type="category" stroke="#10B981" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar
              dataKey="value"
              radius={[5, 5, 5, 5]}
              onMouseEnter={(_, index) => setActiveTopItemIndex(index)}
              onMouseLeave={() => setActiveTopItemIndex(null)}
            >
              {topItemsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeTopItemIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

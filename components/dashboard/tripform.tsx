'use client';
import React, { useState } from "react";
import EcoPreferences from "./ecopreferences";
import { Sun, CloudRain, Leaf } from "lucide-react";

export default function TripForm() {
  const [ecoSuggestions, setEcoSuggestions] = useState(true);

  return (
    <div className="flex flex-col gap-8 bg-white rounded-3xl p-8 shadow-xl max-w-3xl mx-auto mt-10">

      {/* Weather & Eco Preview Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-800">Smart Eco Packing Suggestions</h3>
          <p className="text-sm text-gray-600">Based on your destination, travel dates, and eco preferences.</p>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow-sm">
              <Sun size={18} className="text-yellow-400" /> Sunny
            </div>
            <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full shadow-sm">
              <Leaf size={18} className="text-green-600" /> 78% Eco Items
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <CloudRain size={60} className="text-blue-400 animate-bounce" />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1b0d] animate-slideIn">
            Create a New Trip
          </h1>
          <p className="text-sm md:text-base text-[#4c9a4c] mt-1 animate-fadeIn">
            Customize your travel plan and get smart packing suggestions.
          </p>
        </div>
        <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-200 to-teal-200 text-[#0d1b0d] font-medium shadow hover:scale-105 transition-transform">
          Back to Dashboard
        </button>
      </div>

      {/* Trip Info Form */}
      <div className="flex flex-col gap-5">
        <InputField label="Trip Name" placeholder="My Eco-Adventure" />
        <InputField label="Destination" placeholder="Search for a destination" />

        <div className="flex gap-4 flex-col md:flex-row">
          <InputField label="Start Date" type="date" className="flex-1" />
          <InputField label="End Date" type="date" className="flex-1" />
        </div>

        <InputSelect label="Trip Type" options={["Select trip type", "Business", "Vacation", "Adventure"]} />
        <InputSelect label="Travel Mode" options={["Select travel mode", "Car", "Flight", "Train"]} />

        {/* Eco Suggestions Toggle */}
        <div className="flex justify-between items-center py-2 px-4 bg-green-50 rounded-xl">
          <span className="text-base font-medium text-[#0d1b0d]">Include Eco Suggestions?</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ecoSuggestions}
              onChange={() => setEcoSuggestions(!ecoSuggestions)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-400 transition-all duration-300"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-7 transition-all duration-300"></div>
          </label>
        </div>
      </div>

      {/* Eco Preferences Section */}
      {ecoSuggestions && <EcoPreferences />}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button className="px-6 py-2 rounded-xl bg-gray-200 text-[#0d1b0d] font-semibold hover:bg-gray-300 transition">
          Cancel
        </button>
        <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
          Create Trip
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out forwards; }
        .animate-bounce { animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}

// Reusable Input Field Component
const InputField: React.FC<{ label: string; placeholder?: string; type?: string; className?: string }> = ({ label, placeholder, type = "text", className }) => (
  <label className={`flex flex-col ${className || ""}`}>
    <span className="text-base font-medium text-[#0d1b0d] mb-1">{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      className="border border-green-200 rounded-xl p-4 bg-green-50 text-[#0d1b0d] focus:outline-none focus:ring-2 focus:ring-green-300 transition"
    />
  </label>
);

// Reusable Select Component
const InputSelect: React.FC<{ label: string; options: string[] }> = ({ label, options }) => (
  <label className="flex flex-col">
    <span className="text-base font-medium text-[#0d1b0d] mb-1">{label}</span>
    <select className="border border-green-200 rounded-xl p-4 bg-green-50 text-[#0d1b0d] focus:outline-none focus:ring-2 focus:ring-green-300 transition">
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </label>
);

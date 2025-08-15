"use client";

import { useEffect, useState } from "react";
import { Sun, CloudRain, Cloud, Snowflake, Thermometer, Droplet, Wind, Umbrella } from "lucide-react";

interface WeatherCardProps {
  location: string;
  tempRange: string;
  description: string;
  condition?: "sunny" | "rainy" | "cloudy" | "snowy";
  highTemp?: string;
  lowTemp?: string;
  wind?: string;
  humidity?: string;
  chanceRain?: string;
}

export default function WeatherCard({
  location,
  tempRange,
  description,
  condition = "sunny",
  highTemp = "28°C",
  lowTemp = "22°C",
  wind = "12 km/h",
  humidity = "60%",
  chanceRain = "10%",
}: WeatherCardProps) {
  const [bgClass, setBgClass] = useState("");

  useEffect(() => {
    switch (condition) {
      case "sunny":
        setBgClass("bg-gradient-to-br from-yellow-300 via-yellow-200 to-orange-200");
        break;
      case "rainy":
        setBgClass("bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200");
        break;
      case "cloudy":
        setBgClass("bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200");
        break;
      case "snowy":
        setBgClass("bg-gradient-to-br from-blue-200 via-blue-100 to-white");
        break;
      default:
        setBgClass("bg-gradient-to-br from-yellow-300 via-yellow-200 to-orange-200");
    }
  }, [condition]);

  return (
    <div className={`relative w-full h-screen overflow-hidden ${bgClass} flex flex-col justify-center px-6 md:px-20`}>

      {/* Floating Particles / Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sunny Rays */}
        {condition === "sunny" && (
          <Sun size={140} className="absolute top-20 left-1/2 -translate-x-1/2 text-yellow-400 opacity-60 animate-pulse-slow" />
        )}

        {/* Rain Drops */}
        {condition === "rainy" && [...Array(25)].map((_, i) => (
          <div key={i} className="absolute w-1 h-6 bg-blue-300 rounded animate-fall" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
        ))}

        {/* Clouds drifting */}
        {condition === "cloudy" && [...Array(6)].map((_, i) => (
          <Cloud key={i} size={100} className="absolute text-gray-300 opacity-80 animate-drift-slow" style={{ top: `${i*15+10}%`, left: `${i*15}%` }} />
        ))}

        {/* Snowflakes */}
        {condition === "snowy" && [...Array(30)].map((_, i) => (
          <Snowflake key={i} size={16} className="absolute text-white opacity-80 animate-fall-slow" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
        ))}
      </div>

      {/* Weather Info Card */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        
        {/* Left Info */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-4xl md:text-5xl font-extrabold text-gray-900 animate-slideIn">{location}</p>
          <p className="text-xl font-medium text-green-700 animate-fadeIn">{description}</p>
          <p className="text-3xl font-bold text-gray-900 animate-fadeIn">{tempRange}</p>

          <div className="flex flex-wrap gap-6 mt-4 text-gray-800">
            <div className="flex items-center gap-2">
              <Thermometer size={20} className="text-yellow-500 animate-bounce-slow" /> High: {highTemp}
            </div>
            <div className="flex items-center gap-2">
              <Thermometer size={20} className="text-blue-400 animate-bounce-slow" /> Low: {lowTemp}
            </div>
            <div className="flex items-center gap-2">
              <Wind size={20} className="text-gray-500 animate-bounce-slow" /> Wind: {wind}
            </div>
            <div className="flex items-center gap-2">
              <Droplet size={20} className="text-blue-500 animate-bounce-slow" /> Humidity: {humidity}
            </div>
            <div className="flex items-center gap-2">
              <Umbrella size={20} className="text-blue-600 animate-bounce-slow" /> Chance Rain: {chanceRain}
            </div>
          </div>
        </div>

        {/* Right Icon */}
        <div className="flex-1 flex items-center justify-center">
          {condition === "sunny" && <Sun size={160} className="text-yellow-400 animate-spin-slow" />}
          {condition === "rainy" && <CloudRain size={160} className="text-blue-400 animate-bounce" />}
          {condition === "cloudy" && <Cloud size={160} className="text-gray-400 animate-pulse-slow" />}
          {condition === "snowy" && <Snowflake size={160} className="text-white animate-bounce-slow" />}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fall {
          0% { transform: translateY(-10px); opacity: 0.7; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes fall-slow {
          0% { transform: translateY(-10px); opacity: 0.7; }
          50% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        @keyframes drift-slow {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fall { animation: fall 3s linear infinite; }
        .animate-fall-slow { animation: fall-slow 6s linear infinite; }
        .animate-drift-slow { animation: drift-slow 20s linear infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}

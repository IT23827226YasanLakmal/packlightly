"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { ArrowRight, ArrowLeft } from "lucide-react";

const carouselData = [
  {
    id: 1,
    title: "Top 10 Eco-Friendly Destinations for 2025",
    description: "From green cities to untouched nature escapes.",
    image:
      "https://images.unsplash.com/photo-1524492449090-0c7c4c9d7931?q=80&w=1600",
  },
  {
    id: 2,
    title: "How Airlines Are Cutting Carbon Emissions",
    description: "Learn how aviation is moving toward sustainable fuel.",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764b1c?q=80&w=1600",
  },
  {
    id: 3,
    title: "Zero-Waste Packing: The Ultimate Guide",
    description: "Pack light, smart, and sustainable.",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1600",
  },
];

export default function CoolNewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === carouselData.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={carouselData[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden">
            <img
              src={carouselData[currentIndex].image}
              alt={carouselData[currentIndex].title}
              className="h-64 md:h-96 w-full object-cover rounded-t-2xl"
            />
            <CardContent>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-white"
              >
                {carouselData[currentIndex].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 mt-2 text-sm md:text-base"
              >
                {carouselData[currentIndex].description}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-0"
        variant="ghost"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-0"
        variant="ghost"
      >
        <ArrowRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {carouselData.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              i === currentIndex ? "bg-green-400" : "bg-green-700/50"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

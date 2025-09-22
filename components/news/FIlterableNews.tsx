"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./Card";

const newsData = [
  { id: 1, title: "Eco Destination A", category: "Destinations", country: "USA" },
  { id: 2, title: "Packing Tips", category: "Packing", country: "Canada" },
  { id: 3, title: "Airline Sustainability", category: "Air Travel", country: "USA" },
  { id: 4, title: "Eco Destination B", category: "Destinations", country: "UK" },
];

export default function CoolFilterableNews() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const categories = Array.from(new Set(newsData.map((n) => n.category)));
  const countries = Array.from(new Set(newsData.map((n) => n.country)));

  const filteredNews = newsData.filter((news) => {
    return (
      (!selectedCategory || news.category === selectedCategory) &&
      (!selectedCountry || news.country === selectedCountry)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-green-500 text-black shadow-lg"
                : "bg-green-900 text-green-300 hover:bg-green-500"
            }`}
          >
            {cat}
          </button>
        ))}
        {countries.map((c) => (
          <button
            key={c}
            onClick={() =>
              setSelectedCountry(selectedCountry === c ? null : c)
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedCountry === c
                ? "bg-green-500 text-black shadow-lg"
                : "bg-green-900 text-green-300 hover:bg-green-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {filteredNews.map((news) => (
          <Card key={news.id}>
            <CardContent>
              <h3 className="text-lg font-semibold text-white">{news.title}</h3>
              <p className="text-green-400 text-sm mt-1">
                {news.category} | {news.country}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

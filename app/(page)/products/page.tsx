import React from "react";
import Header from "../../../components/Header";
import FilterBar from "../../../components/product/FilterBar";
import ProductGrid from "../../../components/product/ProductGrid";
import Footer from "../../../components/Footer";

export default function EcoInventoryPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0e1b13] tracking-light text-[32px] font-bold leading-tight">
                  Eco-Friendly Travel Products
                </p>
                <p className="text-[#4e976b] text-sm font-normal leading-normal">
                  Discover sustainable travel essentials that minimize your
                  environmental impact.
                </p>
              </div>
            </div>
            <FilterBar />
            <ProductGrid />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

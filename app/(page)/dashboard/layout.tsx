'use client'
import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#f8fcfa]">
      {/* Fixed Header */}
      <Header />

      {/* Main area: sidebar + content */}
      <div className="flex flex-1 overflow-hidden min-h-screen">
        {/* Sidebar with independent scroll */}
        <div className="w-80 overflow-auto ">
          <Sidebar/>
        </div>

        {/* Main content scrolls independently */}
        <main className="flex-1 overflow-auto p-2">
          {children}
        </main>
      </div>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}

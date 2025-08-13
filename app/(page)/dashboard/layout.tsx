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
  return <>
  <Header />
      <div className="min-h-screen bg-[#f8fcfa] flex">

        <Sidebar onCreateTrip={() => console.log("Create trip clicked")} />
              {children}

  </div>
  <Footer />
  </>;
}

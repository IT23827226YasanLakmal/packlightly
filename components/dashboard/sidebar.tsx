'use client';
import React, { useState } from "react";
import { List, Leaf, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Create New Trip", path: "/dashboard/create-new-trip", icon: <List size={24} /> },
    { label: "Trips", path: "/dashboard/trips", icon: <List size={24} /> },
    { label: "Packing Lists", path: "/dashboard/packinglists", icon: <Leaf size={24} /> },
    { label: "Posts", path: "/dashboard/posts", icon: <Newspaper size={24} /> },
  ];

  return (
    <aside
      className={`flex flex-col justify-between bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg transition-all duration-300
        ${collapsed ? "w-20" : "w-72"} min-h-screen relative`}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-4 top-6 p-1 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-6 transition-opacity duration-300 ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PackLightly</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 px-2">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <MenuItem icon={item.icon} label={item.label} active={pathname === item.path} collapsed={collapsed} />
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 text-gray-500 text-xs text-center transition-opacity duration-300 ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        © 2025 PackLightly
      </div>
    </aside>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, collapsed }) => (
  <div
    className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300
      ${active ? "bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-lg" : "hover:bg-green-50 hover:text-green-600"}
      ${collapsed ? "justify-center" : "justify-start"}`}
    title={collapsed ? label : ""}
  >
    <div className={`transform transition-all duration-300 ${collapsed ? "scale-110" : ""}`}>
      {icon}
    </div>
    {!collapsed && <p className={`text-sm font-medium ${active ? "font-bold" : "font-medium"}`}>{label}</p>}
  </div>
);

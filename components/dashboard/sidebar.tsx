'use client';
import React, { useState } from "react";
import {
  List,
  ChevronLeft,
  ChevronRight,
  Layers,
  ChevronDown,
  Plane,
  Sparkles,
  Newspaper
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const menuItems = [
    {label: "Trips",path: "/dashboard/trips",icon: <Plane size={24} />},
    { label: "Packing Lists", path: "/dashboard/packinglists", icon:<List size={24} /> },
    { label: "Smart Packing", path: "/dashboard/smart-packing", icon:<Sparkles size={24} /> },
    { label: "Posts", path: "/dashboard/posts", icon: <Newspaper size={24} /> },
  ];

  return (
    <aside
      className={`flex flex-col justify-between bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg transition-all duration-300
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
      <div
        className={`flex items-center gap-3 p-6 transition-opacity duration-300 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PackLightly</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 px-2">
        {menuItems.map((item) => (
          <div key={item.path} className="flex flex-col gap-1">
            {/* Parent Menu Item */}
            <MenuItem
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.path)}
              collapsed={collapsed}
              hasChildren={!!item.children}
              expanded={expandedMenus[item.path] || false}
              onClick={() => item.children ? toggleMenu(item.path) : undefined}
              link={!item.children ? item.path : undefined}
            />

            {/* Nested Children */}
            {item.children && (
              <AnimatePresence>
                {expandedMenus[item.path] && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col ml-6 gap-1 overflow-hidden"
                  >
                    {item.children.map((child) => (
                      <Link key={child.path} href={child.path}>
                        <motion.div
                          layout
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-300
                            ${pathname === child.path ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-green-50 hover:text-green-600"}`}
                        >
                          <Layers size={16} />
                          {child.label}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`p-4 text-gray-500 text-xs text-center transition-opacity duration-300 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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
  hasChildren?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  link?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, collapsed, hasChildren, expanded, onClick, link }) => {
  const content = (
    <div
      className={`flex items-center justify-between gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300
      ${active ? "bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-lg" : "hover:bg-green-50 hover:text-green-600"}
      ${collapsed ? "justify-center" : "justify-between"}`}
      title={collapsed ? label : ""}
      onClick={onClick}
    >
      <div className={`flex items-center gap-4 ${collapsed ? "justify-center w-full" : ""}`}>
        <div className={`transform transition-all duration-300 ${collapsed ? "scale-110" : ""}`}>{icon}</div>
        {!collapsed && <p className={`text-sm font-medium ${active ? "font-bold" : "font-medium"}`}>{label}</p>}
      </div>

      {/* Rotating Arrow for Parents */}
      {!collapsed && hasChildren && (
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      )}
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

import React from "react";
import { List, Leaf, Newspaper } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  onCreateTrip?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateTrip }) => {
  return (
    <aside className="w-80 bg-[#f8fcfa] p-4 flex flex-col justify-between min-h-[700px]">
      <div className="flex flex-col gap-4">
        <h1 className="text-[#0e1b13] text-base font-medium">PackLight</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/trips">
            <MenuItem icon={<List size={24} fill="currentColor" />} label="Trips" active />
          </Link>
          <Link href="/dashboard/packinglists">
            <MenuItem icon={<Leaf size={24} />} label="Packing Lists" />
          </Link>
          <Link href="/dashboard/posts">
            <MenuItem icon={<Newspaper size={24} />} label="Posts" />
          </Link>
        </nav>
      </div>
      <button
        onClick={onCreateTrip}
        className="flex items-center justify-center h-10 px-4 rounded-xl bg-[#19e56b] text-[#0e1b13] text-sm font-bold"
      >
        Create New Trip
      </button>
    </aside>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
      active ? "bg-[#e7f3ec]" : ""
    }`}
  >
    <div className="text-[#0e1b13]">{icon}</div>
    <p className="text-[#0e1b13] text-sm font-medium">{label}</p>
  </div>
);

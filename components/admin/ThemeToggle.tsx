"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2 px-4 py-2 rounded-full
        bg-black/70 dark:bg-green-800/70
        border border-green-500/40
        shadow-md shadow-green-900/40
        hover:shadow-green-500/50 transition-all duration-300"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-green-300" />
      )}
      <span className="text-sm font-medium text-white">
        {dark ? "Light" : "Dark"} Mode
      </span>
    </button>
  );
}

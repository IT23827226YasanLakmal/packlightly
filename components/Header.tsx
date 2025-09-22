"use client";

import Logo from "@/public/images/PackLightlyLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const routes = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Community", path: "/community" },
    { name: "Eco Products", path: "/eco-products" },
    { name: "News", path: "/news" },
    { name: "About Us", path: "/about-us" },
  ];

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    user ? router.push("/dashboard/trips") : router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 shadow-md border-b border-gray-200 transition-shadow duration-500">
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="PackLight Logo" width={28} height={28} />
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 hover:text-green-600 transition-colors duration-300">
            PackLightly
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {routes.map((item) =>
            item.name === "Dashboard" ? (
              <a
                key={item.name}
                onClick={handleDashboardClick}
                className="relative text-sm font-medium cursor-pointer group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className="relative text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>

        {/* Auth / Profile Desktop */}
        <div className="hidden md:flex items-center ml-6 gap-4">
          {user ? (
            <div className="relative group">
              <Image
                src={user.photoURL || "/images/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer border-2 border-gray-300 hover:border-green-500 transition-all duration-300"
              />
              <div className="absolute right-0 mt-2 hidden w-44 rounded-xl bg-white shadow-lg group-hover:flex flex-col animate-dropdown">
                <Link href="/profile" className="px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg transition">
                  My Profile
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-white text-sm font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 rounded-lg border border-green-400 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors duration-300">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 transition" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <div className="md:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50 animate-slideIn">
          <div className="flex flex-col mt-16 px-6 gap-6">
            {routes.map((item) =>
              item.name === "Dashboard" ? (
                <a
                  key={item.name}
                  onClick={(e) => { handleDashboardClick(e); setMobileMenu(false); }}
                  className="text-lg font-medium cursor-pointer hover:text-green-600 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} href={item.path} onClick={() => setMobileMenu(false)} className="text-lg font-medium hover:text-green-600 transition-colors">
                  {item.name}
                </Link>
              )
            )}

            <div className="mt-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/profile" onClick={() => setMobileMenu(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    My Profile
                  </Link>
                  <button
                    onClick={() => { signOut(auth); setMobileMenu(false); }}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenu(false)} className="px-4 py-2 rounded-lg bg-green-400 text-white text-center font-semibold">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenu(false)} className="px-4 py-2 rounded-lg border border-green-400 text-green-600 text-center font-semibold">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-dropdown { animation: dropdown 0.25s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </header>
  );
}

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
  const [profileDropdown, setProfileDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdown && !(event.target as Element).closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown]);

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
    if (user) {
      router.push("/dashboard/trips");
    } else {
      router.push("/login");
    }
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
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <Image
                  src={user.photoURL || "/images/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {profileDropdown && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setProfileDropdown(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 z-20 animate-dropdown">
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut(auth);
                          setProfileDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
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

            <div className="mt-6 pt-4 border-t border-gray-200">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Image
                      src={user.photoURL || "/images/default-avatar.png"}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setMobileMenu(false)} 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">My Profile</span>
                  </Link>
                  <button
                    onClick={() => { signOut(auth); setMobileMenu(false); }}
                    className="flex items-center px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-red-600 font-medium">Logout</span>
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

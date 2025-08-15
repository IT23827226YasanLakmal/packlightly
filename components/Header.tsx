"use client";

import Logo from "@/public/images/PackLightlyLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const routes = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Community", path: "/community" },
    { name: "Eco Products", path: "/eco-products" },
    { name: "News", path: "/news" },
    { name: "About Us", path: "/about" },
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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ec] px-10 py-3">
      {/* Logo */}
      <div className="flex items-center gap-4 text-[#0e1b13]">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src={Logo} alt="PackLight Logo" width={25} height={25} />
          <h2 className="text-lg font-bold tracking-[-0.015em]">PackLightly</h2>
        </Link>
      </div>

      {/* Nav + Auth */}
      <div className="flex flex-1 justify-end gap-8">
        {/* Navigation Links */}
        <div className="flex items-center gap-9">
          {routes.map((item) =>
            item.name === "Dashboard" ? (
              <a
                key={item.name}
                onClick={handleDashboardClick}
                className="text-sm font-medium cursor-pointer"
              >
                {item.name}
              </a>
            ) : (
              <Link key={item.name} className="text-sm font-medium" href={item.path}>
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Auth section */}
        {user ? (
          <div className="relative group">
            <Image
              src={user.photoURL || "/images/default-avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer border border-gray-300"
            />
            <div className="absolute right-0 mt-2 hidden w-40 rounded-lg bg-white shadow-lg group-hover:block">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Profile
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button className="px-4 py-2 rounded-lg bg-[#19e56b] text-sm font-bold">
            <Link href="/login">Login</Link> / <Link href="/signup">Sign Up</Link>
          </button>
        )}
      </div>
    </header>
  );
}

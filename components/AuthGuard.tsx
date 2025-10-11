"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "admin" | "user";
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireRole,
  redirectTo = "/login" 
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const role = userDoc.exists() ? userDoc.data()?.role || "user" : "user";
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // If specific role is required but user doesn't have it
    if (requireRole && userRole !== requireRole) {
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard/trips");
      }
      return;
    }

    // If user is logged in but tries to access login/signup pages
    if (!requireAuth && user) {
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard/trips");
      }
      return;
    }
  }, [user, userRole, loading, requireAuth, requireRole, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If specific role is required but user doesn't have it, don't render children
  if (requireRole && userRole !== requireRole) {
    return null;
  }

  // If user is logged in but tries to access login/signup pages, don't render children
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

interface UserWithRole extends User {
  role?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const role = userDoc.exists() ? userDoc.data()?.role || "user" : "user";
          
          // Attach role to user object
          const userWithRole = { ...firebaseUser, role } as UserWithRole;
          setUser(userWithRole);
        } catch (error) {

          // Fallback to user without role
          const userWithRole = { ...firebaseUser, role: "user" } as UserWithRole;
          setUser(userWithRole);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

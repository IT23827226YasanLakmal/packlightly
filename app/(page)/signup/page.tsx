"use client";

import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";
import {
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function SignupPage() {
    return (
        <AuthGuard requireAuth={false}>
            <SignupForm />
        </AuthGuard>
    );
}

function SignupForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🔹 Helper: Validate form inputs
    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setMessage("Full name is required");
            return false;
        }
        
        if (formData.name.trim().length < 2) {
            setMessage("Name must be at least 2 characters long");
            return false;
        }
        
        if (!formData.email) {
            setMessage("Email is required");
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage("Please enter a valid email address");
            return false;
        }
        
        if (!formData.password) {
            setMessage("Password is required");
            return false;
        }
        
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return false;
        }
        
        return true;
    };

    // 🔹 Helper: Get user-friendly error message
    const getErrorMessage = (error: unknown): string => {
        if (!(error instanceof Error)) return "An unknown error occurred";
        
        const firebaseError = error as { code?: string; message: string };
        if (!firebaseError.code) return firebaseError.message;
        
        switch (firebaseError.code) {
            case "auth/email-already-in-use":
                return "An account with this email already exists";
            case "auth/invalid-email":
                return "Please enter a valid email address";
            case "auth/weak-password":
                return "Password is too weak. Please choose a stronger password";
            case "auth/network-request-failed":
                return "Network error. Please check your connection";
            default:
                return firebaseError.message || "Signup failed";
        }
    };

    // 🔹 Helper: Create user in Firestore
    const createUserInFirestore = async (uid: string, email: string, name: string) => {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            email,
            name: name.trim(),
            role: "user",
            createdAt: serverTimestamp(),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message) setMessage("");
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Update user profile with display name
            await updateProfile(userCredential.user, {
                displayName: formData.name.trim()
            });

            // Create user document in Firestore
            await createUserInFirestore(
                userCredential.user.uid,
                formData.email,
                formData.name
            );

            setMessage("Account created successfully! Redirecting...");
            
            // Redirect to dashboard after successful signup
            setTimeout(() => {
                router.push("/dashboard/trips");
            }, 1500);
        } catch (error: unknown) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setMessage("");
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            
            // Create or update user in Firestore
            await createUserInFirestore(
                userCredential.user.uid,
                userCredential.user.email || "",
                userCredential.user.displayName || "Google User"
            );
            
            setMessage("Google sign-up successful! Redirecting...");
            
            // Redirect to dashboard
            setTimeout(() => {
                router.push("/dashboard/trips");
            }, 1500);
        } catch (error: unknown) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white shadow-lg rounded-3xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-black mb-8 text-center">
                    Create Your Account
                </h2>
                <form onSubmit={handleSignup} className="space-y-8" noValidate>
                    <FloatingInput
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <FloatingInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <FloatingInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <FloatingInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-2xl py-3 font-semibold text-white transition 
              ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <Divider text="or" />

                <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className={`w-full flex justify-center items-center gap-3 rounded-2xl border-2 border-green-600 py-3 mt-6 font-semibold text-green-600
            transition 
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-100"}`}
                    aria-label="Sign up with Google"
                    type="button"
                >
                    {/* Simple Google icon substitute */}
                    <span
                        aria-hidden="true"
                        style={{ fontSize: 18, userSelect: "none" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                    </span>
                    Sign up with Google
                </button>

                {message && (
                    <div
                        className={`mt-6 text-center font-medium ${message.includes("successful")
                                ? "text-green-700"
                                : "text-red-600"
                            } select-none`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                <p className="mt-8 text-center text-sm text-black/70">
                    Already have an account?{" "}
                    <a href="/login" className="text-green-600 hover:underline font-semibold">
                        Log in
                    </a>
                </p>
            </div>

            <style>{`
        input:focus + label,
        input:not(:placeholder-shown) + label {
          transform: translateY(-1.5rem);
          font-size: 0.75rem;
          color: #3f6212; /* darker green */
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}

function FloatingInput({
    label,
    name,
    type,
    value,
    onChange,
    disabled,
}: {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}) {
    return (
        <div className="relative">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder=" "
                required
                autoComplete={name === "password" ? "new-password" : "off"}
                className="peer block w-full rounded-2xl border border-green-300 bg-green-50 px-4 pt-5 pb-2 text-black
          placeholder-transparent focus:border-green-600 focus:bg-white focus:outline-none
          focus:ring-1 focus:ring-green-600"
            />
            <label
                htmlFor={name}
                className="absolute left-4 top-3 text-green-500 transition-all pointer-events-none select-none"
            >
                {label}
            </label>
        </div>
    );
}

function Divider({ text }: { text: string }) {
    return (
        <div
            className="relative text-center text-green-400 font-semibold my-6 select-none"
            aria-hidden="true"
        >
            <span className="relative bg-white px-4">{text}</span>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    borderTop: "1.5px solid #a3d4a5",
                    transform: "translateY(-50%)",
                    zIndex: 0,
                }}
            />
        </div>
    );
}

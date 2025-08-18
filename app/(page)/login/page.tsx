"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../../lib/firebaseClient";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await axios.post(
        "https://localhost:5000/api/auth/profile",
        { email },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // Redirect after login success
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMsg(error.message);
      else setErrorMsg("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await userCredential.user.getIdToken();

      // Redirect after Google login success
      router.push("/dashboard/trips");
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMsg(error.message);
      else setErrorMsg("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };


  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMsg) setErrorMsg(null);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMsg) setErrorMsg(null);
  };

  return (
    <main className="min-h-screen bg-green-50 flex justify-center items-center p-5">
      <section className="bg-white p-10 rounded-3xl shadow-xl w-90 max-w-md flex flex-col gap-6 relative overflow-hidden">
        <h2 className="text-3xl font-extrabold text-black mb-2 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-8" noValidate>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            disabled={loading}
            name="email"
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            disabled={loading}
            name="password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white rounded-xl py-3 font-bold text-lg shadow-md transition-colors
              ${loading ? "cursor-not-allowed bg-green-400" : "hover:bg-green-700"}
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <Divider />

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          aria-label="Sign in with Google"
          className={`flex justify-center items-center gap-3 rounded-xl border-2 border-green-600 py-3 text-green-600 font-semibold text-base transition-colors
            ${loading ? "cursor-not-allowed opacity-60" : "hover:bg-green-100 hover:border-green-700 hover:text-green-700"}
          `}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Sign in with Google
        </button>

        {errorMsg && (
          <div
            role="alert"
            className="text-red-700 font-semibold text-sm text-center mt-3 select-none"
          >
            {errorMsg}
          </div>
        )}
      </section>
    </main>
  );
}

function InputField({
  type,
  placeholder,
  value,
  onChange,
  disabled,
  name,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  name: string;
}) {
  return (
    <label
      htmlFor={name}
      className={`relative block w-full cursor-text ${disabled ? "cursor-not-allowed" : ""
        }`}
    >
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        placeholder=" "
        autoComplete={type === "password" ? "current-password" : "email"}
        className="peer w-full rounded-xl border-2 border-green-300 bg-green-50 px-4 pt-5 pb-2 text-black text-base outline-none transition
          placeholder-transparent
          focus:border-green-600 focus:bg-white focus:shadow-md"
      />
      <span
        className="absolute left-4 bottom-3 text-green-500 text-sm pointer-events-none select-none transition-all
          peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-green-400 peer-placeholder-shown:font-normal
          peer-focus:bottom-9 peer-focus:text-green-700 peer-focus:text-sm peer-focus:font-semibold"
      >
        {placeholder}
      </span>
    </label>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="relative text-center text-green-400 font-semibold my-4 select-none"
    >
      <span className="relative bg-white px-4 z-10">or</span>
      <div className="absolute top-1/2 left-0 right-0 border-t-2 border-green-300 -translate-y-1/2" />
    </div>
  );
}

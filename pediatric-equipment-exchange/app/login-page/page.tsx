"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/equipment-gallery");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFC94A]">

      {/* Card */}
      <main className="flex flex-col gap-6 bg-[#FFE09A] rounded-2xl shadow-2xl p-10 w-[90%] max-w-md">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Email Address</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a9e3a]"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5a9e3a]"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-[#5a9e3a] py-3 text-lg font-semibold text-white transition-colors hover:bg-[#4a8a2e] cursor-pointer"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Guest Button */}
        <Link
          href="/equipment-gallery"
          className="w-full rounded-xl border-2 border-[#5a9e3a] py-3 text-lg font-semibold text-[#5a9e3a] text-center transition-colors hover:bg-[#5a9e3a] hover:text-white"
        >
          View as Guest
        </Link>

      </main>
    </div>
  );
}
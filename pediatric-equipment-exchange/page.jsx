"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Sign in with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Fetch the user's role from the `profiles` table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not load your account profile. Contact your administrator.");
      setLoading(false);
      return;
    }

    // 3. Redirect based on role
    if (profile.role === "physical_therapist") {
      router.push("/dashboard/pt");
    } else if (profile.role === "volunteer") {
      router.push("/dashboard/volunteer");
    } else {
      setError("Your account role is not recognized. Contact your administrator.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-md">
            {/* Simple medical cross icon */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-teal-900">Welcome Back</h1>
          <p className="text-teal-600 mt-1 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">

          {/* Role badge info */}
          <div className="flex gap-2 mb-6 justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
              Physical Therapist
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
              Volunteer
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-teal-800 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-teal-200 rounded-lg text-teal-900 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-teal-800 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-teal-200 rounded-lg text-teal-900 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Forgot password */}
          <p className="text-center text-sm text-teal-500 mt-5">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-teal-700 font-medium hover:underline">
              Reset it here
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-teal-400 mt-6">
          Don&apos;t have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

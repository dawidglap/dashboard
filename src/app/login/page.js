"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

const SignIn = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // ✅ Prevent auto redirection
    });

    if (res?.error) {
      setError(
        "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut."
      );
      setLoading(false);
      return;
    }

    // ✅ Fetch the user session after login
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    // ✅ Redirect based on role
    const role = session?.user?.role;
    const redirectUrl =
      role === "manager" || role === "markenbotschafter"
        ? "/dashboard/aufgaben"
        : "/dashboard";

    window.location.href = redirectUrl; // ✅ Redirect manually

    if (!res.ok) {
      setError(
        "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut."
      );
      setLoading(false);
    }
  };

  return (
    <div className="ml-[-16rem] flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-pink-300 to-indigo-300">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-xl"></div>

      {/* Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur-lg border border-white/20"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            Webomo Business
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Willkommen zurück! Melden Sie sich an, um fortzufahren.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-center rounded-full bg-red-600 text-white py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="form-control">
            <input
              type="email"
              name="email"
              placeholder="E-Mail-Adresse"
              className="input input-bordered w-full rounded-full bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-control">
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              className="input input-bordered w-full rounded-full bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`btn w-full rounded-full text-white text-lg font-bold transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "btn-neutral "
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                ></path>
              </svg>
            ) : (
              "Anmelden"
            )}
          </button>
        </form>

        {/* Contact Admin */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Probleme bei der Anmeldung?{" "}
            <a
              href="mailto:kontakt@webomo.ch"
              className="text-indigo-300 hover:underline"
            >
              kontakt@webomo.ch
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;

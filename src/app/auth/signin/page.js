"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (!res.ok) {
      setError(
        "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="absolute top-6 left-8">
        <h1 className="text-3xl font-bold text-white">
          Webomo <br /> Business{" "}
        </h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4">Anmeldung</h1>
        <p className="text-lg text-gray-600 text-center mb-6">
          Melden Sie sich an, um auf Ihr Dashboard zuzugreifen.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-600 text-white p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">E-Mail</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="E-Mail-Adresse eingeben"
              className="input input-bordered w-full rounded-lg"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Passwort</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Passwort eingeben"
              className="input input-bordered w-full rounded-lg"
              required
            />
          </div>

          {/* Remember Me */}
          {/* <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-2"
              />
              Angemeldet bleiben
            </label>
          </div> */}

          {/* Sign In Button */}
          <button type="submit" className="btn btn-primary w-full rounded-lg">
            Anmelden
          </button>
        </form>

        {/* Contact Admin */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sie benötigen Hilfe? Kontaktieren Sie den Administrator unter{" "}
            <a
              href="mailto:kontakt@webomo.ch"
              className="text-blue-500 hover:underline"
            >
              kontakt@webomo.ch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

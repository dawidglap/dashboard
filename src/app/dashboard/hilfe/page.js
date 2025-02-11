"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useSession } from "next-auth/react";

const HelpPage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const res = await fetch(`/api/users/me`);
          if (!res.ok)
            throw new Error("Fehler beim Abrufen der Benutzerdaten.");
          const data = await res.json();
          setUser(data.user);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setLoading(false);
      setSuccess("Fehler: Benutzerinformationen fehlen.");
      return;
    }

    const emailData = {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
      template_params: {
        name: `${user.name} ${user.surname} (${user.role})`,
        surname: "Nicht angegeben",
        birthday: "Nicht relevant",
        email: user.email,
        message: `📌 Betreff: ${subject}\n\n✍️ Nachricht: ${message}`,
        instagram: "",
        facebook: "",
        linkedin: "",
        snapchat: "",
        tiktok: "",
        youtube: "",
        ziel: "Nicht angegeben",
      },
    };

    try {
      await emailjs.send(
        emailData.service_id,
        emailData.template_id,
        emailData.template_params,
        emailData.user_id
      );

      setSuccess("✅ Deine Anfrage wurde erfolgreich gesendet!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("❌ Fehler beim Senden der E-Mail:", error);
      setSuccess(
        "❌ Fehler beim Senden der Nachricht. Bitte versuche es erneut."
      );
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Hilfe & Support
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Hast du Fragen oder brauchst Unterstützung? Sende uns eine Nachricht und
        wir helfen dir gerne weiter.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Dein Name
          </label>
          <input
            type="text"
            value={user ? `${user.name} ${user.surname} (${user.role})` : ""}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Deine E-Mail
          </label>
          <input
            type="email"
            value={user ? user.email : ""}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Betreff
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Gib dein Anliegen ein..."
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Nachricht
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Beschreibe dein Problem oder deine Anfrage..."
            rows="5"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? "Senden..." : "Anfrage senden"}
        </button>
      </form>

      {success && (
        <p
          className={`mt-4 text-center font-semibold ${
            success.includes("Fehler") ? "text-red-500" : "text-green-500"
          }`}
        >
          {success}
        </p>
      )}

      {/* ✅ Future FAQ Section (Commented Out for Now) */}
      {/*
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Häufig gestellte Fragen (FAQ)</h2>
        <div className="mt-4 space-y-2">
          <details className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">Wie lange dauert die Bearbeitung einer Anfrage?</summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Wir bemühen uns, alle Anfragen innerhalb von 24 Stunden zu beantworten.</p>
          </details>
          <details className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">Wo kann ich meine bisherigen Anfragen einsehen?</summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Derzeit gibt es noch kein Ticket-System. Wir arbeiten daran!</p>
          </details>
        </div>
      </div>
      */}
    </div>
  );
};

export default HelpPage;

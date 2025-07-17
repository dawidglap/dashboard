"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import emailjs from "@emailjs/browser";

const SupportForm = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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
      showToast("❌ Fehler: Benutzerinformationen fehlen.", "error");
      return;
    }

    const emailData = {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
      template_params: {
        name: `${user.name} ${user.surname} (${user.role})`,
        email: user.email,
        message: `📌 Betreff: ${subject}\n\n✍️ Nachricht: ${message}`,
      },
    };

    try {
      await emailjs.send(
        emailData.service_id,
        emailData.template_id,
        emailData.template_params,
        emailData.user_id
      );

      showToast("✅ Deine Anfrage wurde erfolgreich gesendet!", "success");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("❌ Fehler beim Senden der E-Mail:", error);
      showToast(
        "❌ Fehler beim Senden der Nachricht. Bitte versuche es erneut.",
        "error"
      );
    }

    setLoading(false);
  };

  // Toast handler
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="relative p-6 bg-white/30 dark:bg-slate-800/30  backdrop-blur-lg shadow-2xl rounded-2xl">
      {/* ✅ Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 badge ${toast.type === "success" ? "badge-success" : "badge-error"
            } text-white px-4 py-2 rounded-full shadow-lg`}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name (Prefilled) */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Dein Name
          </label>
          <input
            type="text"
            value={user ? `${user.name} ${user.surname} (${user.role})` : ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
          />
        </div>

        {/* Email (Prefilled) */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            E-Mail
          </label>
          <input
            type="email"
            value={user ? user.email : ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Betreff
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="input input-bordered rounded-full w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
            placeholder="Gib dein Anliegen ein..."
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Nachricht
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="textarea textarea-bordered rounded-xl w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
            placeholder="Beschreibe dein Problem oder deine Anfrage..."
            rows="5"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center sm:justify-start">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:from-indigo-500 dark:to-purple-400"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Anfrage senden"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SupportForm;

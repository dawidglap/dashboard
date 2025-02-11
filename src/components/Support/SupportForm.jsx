"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import emailjs from "@emailjs/browser";

const SupportForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (session?.user) {
      console.log("🔍 Session Data:", session.user); // Debugging

      const userName = session.user.name || "Unbekannt";
      const userSurname = session.user.surname || "";
      const userRole = session.user.role || "Unbekannt";

      setFormData({
        name: `${userName} ${userSurname} (${userRole})`.trim(),
        email: session.user.email || "",
        subject: "",
        message: "",
      });
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: formData.subject,
        },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      setSuccessMessage("✅ Deine Anfrage wurde erfolgreich gesendet!");
      setFormData({ ...formData, subject: "", message: "" }); // Reset only subject and message
    } catch (error) {
      console.error("❌ Fehler beim Senden:", error);
      setSuccessMessage("❌ Fehler: Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Kontakt Support</h2>

      {successMessage && (
        <p className="mb-4 text-center text-sm font-medium text-green-500">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name (Prefilled) */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            👤 Dein Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>

        {/* Email (Prefilled) */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            📧 E-Mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            📝 Betreff
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="input input-bordered rounded-full w-full"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            ✍️ Nachricht
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered rounded-xl w-full"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-black from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:bg-slate-700"
          disabled={loading}
        >
          {loading ? "⏳ Senden..." : "📩 Anfrage senden"}
        </button>
      </form>
    </div>
  );
};

export default SupportForm;

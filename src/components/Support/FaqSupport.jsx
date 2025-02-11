"use client";

import { useState } from "react";

const FaqSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "❓ Wie kann ich mein Passwort zurücksetzen?",
      answer:
        "Derzeit können Passwörter nur durch den Administrator zurückgesetzt werden. Bitte kontaktiere den Support für Hilfe.",
    },
    {
      question:
        "📩 Ich habe eine Anfrage gesendet, wann erhalte ich eine Antwort?",
      answer:
        "Wir bemühen uns, alle Anfragen innerhalb von 24-48 Stunden zu beantworten.",
    },
    {
      question: "🔄 Kann ich meine E-Mail-Adresse ändern?",
      answer:
        "Ja, du kannst deine E-Mail-Adresse ändern. Bitte kontaktiere den Support mit der neuen Adresse.",
    },
    {
      question: "📆 Wie kann ich einen Termin für einen Support-Call buchen?",
      answer:
        "Du kannst einen Termin über das Demo Calls Modul in deinem Dashboard buchen.",
    },
    {
      question: "💰 Wie funktioniert die Provisionsauszahlung?",
      answer:
        "Provisionen werden monatlich berechnet und automatisch auf dein hinterlegtes Konto überwiesen.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        ❔ Häufig gestellte Fragen (FAQ)
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 dark:border-gray-700"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left py-3 px-4 text-gray-800 dark:text-gray-200 font-medium flex justify-between items-center"
            >
              {faq.question}
              <span className="text-gray-600 dark:text-gray-400">
                {openIndex === index ? "▲" : "▼"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-3 text-gray-600 dark:text-gray-300 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSupport;

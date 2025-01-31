"use client";

import { useEffect, useState } from "react";

const ToastNotification = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out before removing
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    visible && (
      <div
        className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm text-white transition-opacity duration-300 ${
          type === "error" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {message}
      </div>
    )
  );
};

export default ToastNotification;

"use client";

import { useEffect } from "react";

const ToastNotification = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full">
      <div className="badge badge-success shadow-lg">
        <span>{message}</span>
        {/* <button className="btn btn-sm btn-ghost" onClick={onClose}>
          ✕
        </button> */}
      </div>
    </div>
  );
};

export default ToastNotification;

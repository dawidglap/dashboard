"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import AnimatePresence
import { FaSpinner } from "react-icons/fa";
import UserBasicInfo from "./UserBasicInfo";
import UserSubscriptionInfo from "./UserSubscriptionInfo";
import UserAddressInfo from "./UserAddressInfo";
import ToastNotification from "./ToastNotification";

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "", // ✅ Keep empty so it doesn't overwrite hash
    name: "",
    surname: "",
    birthday: "",
    role: "admin",
    manager_id: "",
    phone_number: "",
    user_street: "",
    user_street_number: "",
    user_postcode: "",
    user_city: "",
    subscription_expiration: "",
    is_active: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // ✅ Toast visibility

  useEffect(() => {
    if (user) {
      // ✏️ Modal Edit: Popola i dati esistenti
      setNewUser({
        email: user.email || "",
        name: user.name || "",
        surname: user.surname || "",
        birthday: user.birthday || "",
        role: user.role || "admin",
        phone_number: user.phone_number || "",
        user_street: user.user_street || "",
        user_street_number: user.user_street_number || "",
        user_postcode: user.user_postcode || "",
        user_city: user.user_city || "",
        subscription_expiration: user.subscription_expiration
          ? new Date(user.subscription_expiration).toISOString().split("T")[0]
          : "",
        is_active: user.is_active !== undefined ? user.is_active : true,
        password: "",
        manager_id: user.manager_id || "", // <- se presente
      });
    } else {
      // 🆕 Modal Nuovo: Reset totale
      setNewUser({
        email: "",
        password: "",
        name: "",
        surname: "",
        birthday: "",
        role: "admin",
        phone_number: "",
        user_street: "",
        user_street_number: "",
        user_postcode: "",
        user_city: "",
        subscription_expiration: "",
        is_active: true,
        manager_id: "", // <- nuovo campo
      });
    }
  }, [user]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prev) => ({
      ...prev,
      [name]: name === "password" && value === "" ? prev.password : value,
    }));

    if (name === "subscription_expiration") {
      setNewUser((prev) => ({
        ...prev,
        is_active: new Date(value) >= new Date(),
      }));
    }
  };

  const handleSaveUser = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const userPayload = { ...newUser };
      if (!userPayload.password) {
        delete userPayload.password; // ✅ Do not send password if empty
      }

      const res = await fetch("/api/users", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?._id, ...userPayload }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const savedUser = data.data; // ✅ Extract new user from response

      onSave(savedUser); // ✅ Pass the created user back
      setShowToast(true); // ✅ Show toast
      setTimeout(() => onClose(), 1000); // ✅ Close modal after toast disappears
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const [allUsers, setAllUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setAllUsers(data.users || []);
  };

  fetchUsers();
}, []);

const managerList = allUsers.filter(
  (u) => u.role === "manager" || u.role === "admin"
);


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="modal-box max-w-5xl bg-base-100 shadow-lg rounded-2xl p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-2xl font-bold text-base-content">
                {user ? "Benutzer bearbeiten" : "Neuen Benutzer hinzufügen"}
              </h3>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Form Layout */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <div className="col-span-2">
              <UserBasicInfo
  newUser={newUser}
  handleChange={handleChange}
  managers={managerList}
/>

              </div>
              <div className="col-span-2">
                <UserAddressInfo
                  newUser={newUser}
                  handleChange={handleChange}
                />
                <div className="col-span-2">
                  <UserSubscriptionInfo
                    newUser={newUser}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="btn btn-sm btn-outline rounded-full"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveUser}
                className="btn btn-sm btn-neutral hover:text-white rounded-full flex items-center"
              >
                {isSaving ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  "Speichern"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showToast && (
        <ToastNotification
          message="✅ Benutzer wurde erfolgreich gespeichert!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;

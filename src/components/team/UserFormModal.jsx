"use client";

import { useState, useEffect } from "react";
import UserBasicInfo from "./UserBasicInfo";
import UserSubscriptionInfo from "./UserSubscriptionInfo";
import UserAddressInfo from "./UserAddressInfo";

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
  const [newUser, setNewUser] = useState({
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
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setNewUser({
        ...user,
        is_active: new Date(user.subscription_expiration) >= new Date(),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
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
      const res = await fetch("/api/users", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?._id, ...newUser }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSave({ ...newUser, _id: user?._id });
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    isOpen && (
      <div className="modal modal-open">
        <div className="modal-box space-y-4 bg-indigo-100">
          <UserBasicInfo newUser={newUser} handleChange={handleChange} />
          <UserAddressInfo newUser={newUser} handleChange={handleChange} />
          <UserSubscriptionInfo newUser={newUser} handleChange={handleChange} />
          <div className="modal-action flex justify-between">
            <button
              onClick={onClose}
              className="btn btn-sm bg-gray-400 hover:bg-gray-500"
            >
              Schließen
            </button>
            <button
              onClick={handleSaveUser}
              className="btn btn-sm bg-green-500"
              disabled={isSaving}
            >
              {isSaving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserFormModal;

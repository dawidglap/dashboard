"use client";

import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // ✅ Ensure state exists
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    user_street: "",
    user_street_number: "",
    user_postcode: "",
    user_city: "",
    subscription_expiration: "",
  });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Fehler beim Laden des Profils");
        const data = await res.json();
        setUser(data.user);
        setFormData({
          email: data.user.email,
          phone_number: data.user.phone_number || "",
          user_street: data.user.user_street || "",
          user_street_number: data.user.user_street_number || "",
          user_postcode: data.user.user_postcode || "",
          user_city: data.user.user_city || "",
          subscription_expiration: data.user.subscription_expiration || "",
        });
      } catch (error) {
        console.error("❌ Fehler:", error.message);
        setError(error.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id, ...formData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Fehler beim Speichern");
      }

      // ✅ Fetch the updated user data
      const updatedRes = await fetch("/api/users/me");
      if (!updatedRes.ok) throw new Error("Fehler beim Laden des Profils");

      const updatedData = await updatedRes.json();
      setUser(updatedData.user);
      setIsEditing(false);

      // ✅ Show success toast
      setToastMessage("✅ Profil erfolgreich aktualisiert!");
      setTimeout(() => setToastMessage(null), 2000); // Auto-hide toast
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setError(error.message);

      // ❌ Show error toast
      setToastMessage(`❌ Fehler: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Lädt...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">📄 Dein Profil</h2>

      <div className="flex gap-6">
        <ProfileForm
          formData={formData}
          handleChange={handleChange}
          isEditing={isEditing}
        />
        <ProfileAvatar user={user} />
      </div>

      <ProfileActions
        isEditing={isEditing}
        setIsEditing={setIsEditing} // ✅ Pass function correctly
        handleSaveChanges={handleSaveChanges}
        isSaving={isSaving}
      />
      {/* ✅ Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

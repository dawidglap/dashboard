"use client";

import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const [isLoading, setIsLoading] = useState(true); // ✅ Track loading state

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
      } finally {
        setIsLoading(false); // ✅ Stop loading after data fetch
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
      setTimeout(() => setToastMessage(null), 2000);
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setError(error.message);
      setToastMessage(`❌ Fehler: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Mein Profil</h2>

      {isLoading ? (
        // ✅ DaisyUI Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="skeleton h-10 w-full"></div>
            <div className="skeleton h-10 w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
            <div className="skeleton h-10 w-full"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="skeleton w-24 h-24 rounded-full"></div>
            <div className="skeleton h-6 w-32 mt-3"></div>
            <div className="skeleton h-4 w-20 mt-1"></div>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ Responsive Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side: Form */}
            <div className="flex flex-col space-y-4">
              <ProfileForm
                formData={formData}
                handleChange={handleChange}
                isEditing={isEditing}
              />
            </div>

            {/* Right Side: Avatar */}
            <div className="flex flex-col space-y-4 items-center">
              <ProfileAvatar user={user} />
            </div>
          </div>

          {/* Actions */}
          <ProfileActions
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveChanges={handleSaveChanges}
            isSaving={isSaving}
          />
        </>
      )}

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

"use client";

import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


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
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();
  const sessionUser = session?.user;



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me/populated");
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
      setToastMessage("Profil erfolgreich aktualisiert!");
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

  const copyToClipboard = () => {
    if (!user?._id) return;
    const affiliateLink = `https://business.webomo.ch/ref/${user._id}`;
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg">
      <h2 className="text-xl md:text-4xl font-extrabold mb-6 text-center md:text-left">
        Mein Profil
      </h2>

      {isLoading ? (
        // ✅ DaisyUI Skeleton Loader
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:flex-none">
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
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:flex-none">
            {/* Left Side: Form */}
            <div className="flex flex-col space-y-4 order-2 lg:order-1 text-xs md:text-sm">
              <ProfileForm
                formData={formData}
                handleChange={handleChange}
                isEditing={isEditing}
              />
              <div className="w-full mt-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dein Empfehlungslink
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`https://business.webomo.ch/ref/${user._id}`}
                    readOnly
                    className="input py-5 input-sm input-bordered w-full rounded-full bg-indigo-100 ps-4 dark:bg-gray-800 text-xs md:text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 badge badge-primary text-[10px] md:text-xs"
                  >
                    {copied ? "Kopiert!" : "Kopieren"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Avatar */}
            <div className="relative h-full w-full order-1 lg:order-2 md:mt-0 mt-6">
              {/* Business Partner Badge - top aligned */}
              {user?.role === "markenbotschafter" && user.manager && (
                <div className="justify-center flex mt-6 w-full px-2 mb-4">
                  <div className="inline-block rounded-full bg-indigo-100 text-indigo-800 text-[10px] md:text-xs font-medium px-3 py-1.5 md:px-4 md:py-2 dark:bg-indigo-800 dark:text-white">
                    <span className="font-semibold">Dein Business Partner:</span>{" "}
                    {user.manager.name} {user.manager.surname}
                    <span className="font-semibold ms-2">e-mail:</span>{" "}
                    {user.manager.email}
                  </div>
                </div>
              )}

              {/* Centered Avatar */}
              <div className="flex items-center justify-center h-full mt-[-24px]">
                <ProfileAvatar user={user} />
              </div>
              {/* Show Actions below avatar on mobile/tablet (md and smaller) */}
              <div className="block lg:hidden mt-6 text-xs md:text-sm">
                <ProfileActions
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleSaveChanges={handleSaveChanges}
                  isSaving={isSaving}
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          {/* Actions - shown only on lg+ at bottom */}
          <div className="mt-6 text-xs md:text-sm hidden lg:block">
            <ProfileActions
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleSaveChanges={handleSaveChanges}
              isSaving={isSaving}
            />
          </div>

        </>
      )}

      {/* ✅ Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <div className="alert alert-success text-xs md:text-sm rounded-full">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>

  );
};

export default UserProfile;

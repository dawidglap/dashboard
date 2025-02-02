import { FaEdit, FaSave, FaTimesCircle, FaSpinner } from "react-icons/fa";

const ProfileActions = ({
  isEditing,
  setIsEditing,
  handleSaveChanges,
  isSaving,
}) => {
  return (
    <div className="flex justify-end mt-6 gap-4">
      {isEditing ? (
        <>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-outline"
            disabled={isSaving} // ✅ Disable while saving
          >
            <FaTimesCircle className="mr-2" /> Abbrechen
          </button>
          <button
            onClick={handleSaveChanges}
            className="btn btn-primary"
            disabled={isSaving} // ✅ Disable while saving
          >
            {isSaving ? (
              <FaSpinner className="mr-2 animate-spin" />
            ) : (
              <FaSave className="mr-2" />
            )}
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-secondary"
        >
          <FaEdit className="mr-2" /> Profil bearbeiten
        </button>
      )}
    </div>
  );
};

export default ProfileActions;

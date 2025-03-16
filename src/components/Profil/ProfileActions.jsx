import { FaEdit, FaSave, FaTimesCircle, FaSpinner } from "react-icons/fa";

const ProfileActions = ({
  isEditing,
  setIsEditing,
  handleSaveChanges,
  isSaving,
}) => {
  return (
    <div className="flex justify-start mt-6">
      {isEditing ? (
        <div className="flex gap-3">
          {/* Cancel Button */}
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-outline btn-sm rounded-full"
            disabled={isSaving} // ✅ Disable while saving
          >
            <FaTimesCircle className="mr-2" />
            Abbrechen
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="btn btn-outline btn-success rounded-full btn-sm"
            disabled={isSaving} // ✅ Disable while saving
          >
            {isSaving ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Speichern
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-neutral btn-sm rounded-full flex items-center gap-2"
        >
          <FaEdit />
          Profil bearbeiten
        </button>
      )}
    </div>
  );
};

export default ProfileActions;

import { FaEdit, FaSave, FaTimesCircle, FaSpinner } from "react-icons/fa";

const ProfileActions = ({
  isEditing,
  setIsEditing,
  handleSaveChanges,
  isSaving,
}) => {
  return (
    <div className="mt-6">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-3 w-full">
          {/* Cancel Button */}
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-outline btn-sm rounded-full w-full sm:w-auto"
            disabled={isSaving}
          >
            <FaTimesCircle className="mr-2" />
            Abbrechen
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="btn btn-success btn-sm rounded-full w-full sm:w-auto mt-2 sm:mt-0"
            disabled={isSaving}
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
          className="btn btn-neutral btn-sm rounded-full flex items-center gap-2 w-full sm:w-auto"
        >
          <FaEdit />
          Profil bearbeiten
        </button>
      )}
    </div>
  );
};

export default ProfileActions;

"use client";

import { useState } from "react";

const BulkActions = ({
  selectedTasks,
  setSelectedTasks,
  setTasks,
  showToast,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    const taskIds = selectedTasks.map((taskId) => taskId.split("-")[0]); // ✅ Extract only task._id

    try {
      const res = await fetch("/api/tasks/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds }),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || "Löschen fehlgeschlagen");

      // ✅ Remove deleted tasks from UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !taskIds.includes(task._id))
      );

      // ✅ Close modal & clear selection
      setIsDeleteModalOpen(false);
      setSelectedTasks([]);

      // ✅ Show success toast
      showToast(`✅ ${responseData.message}`, "success");
    } catch (error) {
      console.error("❌ Bulk Delete Error:", error);
      showToast(error.message, "error");
    }
  };

  const handleBulkUpdate = async (newStatus) => {
    setIsProcessing(true);

    try {
      const res = await fetch("/api/tasks/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIds: selectedTasks,
          updateFields: { status: newStatus },
        }),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || "Update fehlgeschlagen");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          selectedTasks.includes(task._id)
            ? { ...task, status: newStatus }
            : task
        )
      );

      setSelectedTasks([]);
      showToast("✅ Status erfolgreich aktualisiert!", "success");
    } catch (error) {
      console.error("❌ Fehler:", error);
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-indigo-50  py-2 px-3">
      {/* 🛠️ Bulk Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isProcessing}
          className="btn btn-outline btn-error btn-sm"
        >
          🗑️ Löschen ({selectedTasks.length})
        </button>

        <button
          onClick={() => handleBulkUpdate("done")}
          disabled={isProcessing}
          className="btn btn-outline btn-success btn-sm"
        >
          ✅ Erledigt
        </button>

        <button
          onClick={() => handleBulkUpdate("in_progress")}
          disabled={isProcessing}
          className="btn btn-outline btn-warning btn-sm"
        >
          🚀 In Bearbeitung
        </button>
      </div>

      {/* 🔥 DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600">
              ⚠️ Bist du sicher?
            </h3>
            <p className="py-2 text-gray-700">
              Diese Aktion kann nicht rückgängig gemacht werden!
            </p>
            <div className="modal-action">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-sm btn-neutral"
              >
                Abbrechen
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-sm btn-error"
              >
                Ja, Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;

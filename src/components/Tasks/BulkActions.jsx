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
    <div className="flex items-center justify-between  py-3  ">
      {/* 🛠️ Bulk Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isProcessing}
          className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-200 rounded-full flex items-center px-4"
        >
          🗑️ Löschen ({selectedTasks.length})
        </button>

        <button
          onClick={() => handleBulkUpdate("done")}
          disabled={isProcessing}
          className="btn btn-sm bg-green-50 text-green-700 hover:bg-green-200 rounded-full flex items-center px-4"
        >
          ✅ Erledigt
        </button>

        <button
          onClick={() => handleBulkUpdate("in_progress")}
          disabled={isProcessing}
          className="btn btn-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-200 rounded-full flex items-center px-4"
        >
          🚀 In Bearbeitung
        </button>
      </div>

      {/* 🔥 DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="modal modal-open flex items-center justify-center backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="modal-box max-w-md w-full bg-white shadow-lg rounded-2xl p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                ⚠️ Bist du sicher?
              </h3>
            </div>

            {/* Content */}
            <p className="py-4 text-gray-700 text-sm">
              Diese Aktion kann nicht rückgängig gemacht werden!
            </p>

            {/* Modal Actions */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-sm btn-outline rounded-full"
              >
                Abbrechen
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-full px-4"
              >
                Ja, Löschen
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;

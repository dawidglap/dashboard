import React from "react";

const TasksLoader = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Aufgaben</h1>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Titel</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Priorität</th>
              <th className="py-4 px-6">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-6">
                  <div className="skeleton w-24 h-6 bg-gray-300 rounded"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="skeleton w-16 h-6 bg-gray-300 rounded"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="skeleton w-20 h-6 bg-gray-300 rounded"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="skeleton w-12 h-6 bg-gray-300 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksLoader;

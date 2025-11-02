import { useState } from "react";
import ProgramsList from "./ProgramsList";
import CreateProgramPage from "./CreateProgramPage";

export default function AdminDashboard() {
  const [view, setView] = useState("list"); // "list" или "create"

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Управление на докторантски програми
      </h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-lg ${
            view === "list" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Виж всички програми
        </button>

        <button
          onClick={() => setView("create")}
          className={`px-4 py-2 rounded-lg ${
            view === "create" ? "bg-green-600 text-white" : "bg-white border"
          }`}
        >
          Създай нова програма
        </button>
      </div>

      {view === "list" ? <ProgramsList /> : <CreateProgramPage />}
    </div>
  );
}

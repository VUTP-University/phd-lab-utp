export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col justify-between p-4 min-h-screen">
      {/* Top section */}
      <div>
        <h1 className="text-2xl font-bold mb-8">UTP PhD Lab</h1>
        <button
          onClick={() => setActivePage("dashboard")}
          className={`text-left px-4 py-2 rounded-lg mb-2 transition ${
            activePage === "dashboard"
              ? "bg-gray-700"
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          Потребителски панел
        </button>
        <button
          onClick={() => setActivePage("phdlab")}
          className={`text-left px-4 py-2 rounded-lg transition ${
            activePage === "phdlab"
              ? "bg-gray-700"
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          Моят PhD Lab
        </button>
      </div>

      {/* Bottom (Admin section) */}
      <div className="border-t border-gray-700 pt-4 mt-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-300">
          Админ панел
        </h2>
        <button
          onClick={() => setActivePage("manageUsers")}
          className={`text-left px-4 py-2 rounded-lg mb-2 transition ${
            activePage === "manageUsers"
              ? "bg-gray-700"
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          Управление на потребители
        </button>
        <button
          onClick={() => setActivePage("contentManagement")}
          className={`text-left px-4 py-2 rounded-lg transition ${
            activePage === "contentManagement"
              ? "bg-gray-700"
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          Управление на съдържание
        </button>
      </div>
    </div>
  );
}
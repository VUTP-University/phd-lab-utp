export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">UTP PhD Lab</h1>
      <button
        onClick={() => setActivePage("dashboard")}
        className={`text-left px-4 py-2 rounded-lg mb-2 transition ${
          activePage === "dashboard"
            ? "bg-gray-700"
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => setActivePage("phdlab")}
        className={`text-left px-4 py-2 rounded-lg transition ${
          activePage === "phdlab"
            ? "bg-gray-700"
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        My PhD Lab
      </button>
    </div>
  );
}
import React from "react";
import { useEffect, useState } from "react";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <main className="p-6 bg-gray-50 flex-1 flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          No user data found. Please log in.
        </p>
      </main>
    );
  }

  // Split name to get first/last if available
  const [firstName, lastName] = user.name ? user.name.split(" ") : ["", ""];

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* Left Section: Title + Search */}
      <div className="flex items-center gap-6 w-2/3">
        <h1 className="text-xl font-semibold text-gray-800">PhD Panel</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border px-4 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section: Notifications + User */}
      <div className="flex items-center gap-6">
        <button className="relative text-xl">
          🔔
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <img
            src={user.picture}
            alt="User Avatar"
            className="rounded-full w-10 h-10"
          />
          <span className="text-sm font-medium text-gray-700">{ user.name }</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

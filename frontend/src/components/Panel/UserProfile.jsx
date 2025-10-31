import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <main className="p-6 bg-gray-50 flex-1 flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No user data found. Please log in.</p>
      </main>
    );
  }

  // Split name to get first/last if available
  const [firstName, lastName] = user.name ? user.name.split(' ') : ['', ''];

  return (
    <main className="p-6 bg-gray-50 flex-1">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.picture}
            alt="Avatar"
            className="rounded-full w-24 h-24"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">
              {user.email}
              {user.is_lab_admin && (
                <span className="ml-2 text-sm text-green-600 font-semibold">
                  (Lab Admin)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <ul className="space-y-2">
              <li>
                <strong>First Name:</strong> {firstName || "—"}
              </li>
              <li>
                <strong>Last Name:</strong> {lastName || "—"}
              </li>
              <li>
                <strong>Email:</strong> {user.email}
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <ul className="space-y-2">
              <li>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-medium">Active</span>
              </li>
              <li>
                <strong>Last Login:</strong> {new Date().toLocaleString()}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
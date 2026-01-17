import React from "react";

function UserCard({ user }) {
  if (!user) return null;

  return (
    <div className="flex justify-center mt-8 mb-8 w-full px-4">
      <div className="primary_object p-8 w-full max-w-6xl flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-shadow py-4">
        {/* Profile picture */}
        <img
          src={user.picture}
          alt={user.name}
          className="w-28 h-28 rounded-full object-cover border-2 border-[var(--border)]"
        />

        {/* User info */}
        <div className="flex flex-col items-center text-center">
          <h2 className="primary_text text-2xl mb-2">{user.name}</h2>
          <p className="normal_text mb-1">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default UserCard;

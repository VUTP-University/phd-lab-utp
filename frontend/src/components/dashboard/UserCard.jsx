import React from "react";

function UserCard({ user }) {
  if (!user) return null;

  return (
    <section className="primary_object py-6 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-4">
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
    </section>
  );
}

export default UserCard;

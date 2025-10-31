import React from "react";
import Sidebar from "../../components/Panel/Sidebar";
import Topbar from "../../components/Panel/Topbar";
import UserProfile from "../../components/Panel/UserProfile";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />
      
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-10 bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your PhD Panel
          </h1>
          <p className="text-gray-600 mb-8">
            Here you'll be able to track your progress, view courses, and access your PhD resources.
          </p>
          <UserProfile />
        </div>
        
      </div>
    </div>
  );
}
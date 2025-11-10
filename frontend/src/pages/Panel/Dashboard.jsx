import { useState } from "react";
import React from "react";
import Sidebar from "../../components/Dashboard/Sidebar";
// User Profile components
import UserProfile from "../../components/Dashboard/UserProfile";
import MyPhDLab from "../../components/Dashboard/PhdLab";
// Admin components
import ContentManagement from "../../components/Dashboard/ContentManagement/ContentManagement";

import "../../index.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <UserProfile />;
      case "phdlab":
        return <MyPhDLab />;
      case 'contentManagement':
        return <ContentManagement />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
    </div>
  );
}
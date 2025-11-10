import { useState } from "react";
import React from "react";
import Sidebar from "../../components/Dashboard/Sidebar";
import MyPhDLab from "./PhdLab";
import Topbar from "../../components/Dashboard/Topbar";
import UserProfile from "./UserProfile";
import "../../index.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <UserProfile />;
      case "phdlab":
        return <MyPhDLab />;
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
import React, { useState } from "react";
import SectionForm from "./SectionForm";
import CategoryForm from "./CategoryForm";
import ContentForm from "./ContentForm";
import { Button } from "./Button";


export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("sections");

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Управление на съдържание</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["sections", "categories", "contents"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "sections"
              ? "Секции"
              : tab === "categories"
              ? "Категории"
              : "Съдържание"}
          </Button>
        ))}
      </div>

      {/* Dynamic Forms */}
      {activeTab === "sections" && <SectionForm />}
      {activeTab === "categories" && <CategoryForm />}
      {activeTab === "contents" && <ContentForm />}
    </div>
  );
}
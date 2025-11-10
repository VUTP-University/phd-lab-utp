/* ----- SECTION FORM ----- */

import { useState } from "react";
import { Card } from "./Card";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { Button } from "./Button";

export default function SectionForm() {
  const [sections, setSections] = useState([
    { id: 1, name: "Документи", order: 1, visible: true },
  ]);
  const [newSection, setNewSection] = useState("");

  const addSection = () => {
    if (!newSection.trim()) return;
    setSections([
      ...sections,
      {
        id: Date.now(),
        name: newSection,
        order: sections.length + 1,
        visible: true,
      },
    ]);
    setNewSection("");
  };

  const toggleVisibility = (id) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">Управление на секции</h2>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Нова секция..."
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            className="border rounded-lg p-2 flex-1"
          />
          <Button onClick={addSection}>Добави</Button>
        </div>

        <ul>
          {sections.map((section) => (
            <li
              key={section.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <span className="font-medium">{section.name}</span>{" "}
                <span className="text-sm text-gray-500">
                  (Ред: {section.order})
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(section.id)}
                >
                  {section.visible ? "Скрий" : "Покажи"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setSections(sections.filter((s) => s.id !== section.id))
                  }
                >
                  Изтрий
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
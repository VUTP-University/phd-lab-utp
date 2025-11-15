/* ----- SECTION FORM ----- */

import { useState } from "react";
import { Card } from "./Card";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { Button } from "./Button";

export default function SectionForm() {
  // Update dynamically reading from database
  const [sections, setSections] = useState([
    { id: 1, name: "Документи", order: 1, visible: true },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add new section
  const addSection = () => {
    if (!formData.title.trim()) return;

    const newSection = {
      id: Date.now(),
      name: formData.title,
      description: formData.description,
      order: formData.order ? parseInt(formData.order, 10) : sections.length + 1,
      visible: true,
    };

    setSections([...sections, newSection]);

    // Clear form
    setFormData({ title: "", description: "", order: "" });
  };

  const toggleVisibility = (id) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  };

  const deleteSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">Управление на секции</h2>
      </CardHeader>

      <CardContent>
        {/* FORM */}
        <div className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Заглавие на секцията"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="description"
            placeholder="Описание на секцията"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            name="order"
            placeholder="Ред на секцията"
            value={formData.order}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <Button onClick={addSection}>Добави секция</Button>
        </div>

        {/* SECTION LIST */}
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
                <p className="text-sm text-gray-600">{section.description}</p>
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
                  onClick={() => deleteSection(section.id)}
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
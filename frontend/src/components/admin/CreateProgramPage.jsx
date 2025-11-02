import { useState, useEffect } from "react";
import axios from "axios";
import CreateCourseForm from "./CreateCourseForm";

export default function CreateProgramPage() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [message, setMessage] = useState("");

  const loadCourses = () => {
    axios.get("http://127.0.0.1:8000/api/courses/")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const toggleCourse = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const createProgram = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/programs/", {
        title,
        courses: selected,
      });
      setMessage("✅ Програмата е създадена успешно!");
      setTitle("");
      setSelected([]);
      loadCourses();
    } catch (err) {
      console.error(err);
      setMessage("❌ Грешка при създаване на програмата!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Създай нова програма
      </h2>

      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={createProgram} className="space-y-4">
        <input
          type="text"
          value={title}
          placeholder="Заглавие на програмата"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        />

        <div>
          <label className="font-semibold mb-2 block">Избери курсове:</label>
          <div className="grid grid-cols-2 gap-2">
            {courses.map(c => (
              <label
                key={c.id}
                className="flex items-center gap-2 border rounded p-2 hover:bg-blue-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(c.id)}
                  onChange={() => toggleCourse(c.id)}
                />
                {c.name} ({c.credits} кредита)
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Създай програма
        </button>
      </form>

      <hr className="my-6" />

      {/* 🔹 Бутон за показване на формата за нов курс */}
      {!showCourseForm ? (
        <button
          onClick={() => setShowCourseForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Създай нов курс
        </button>
      ) : (
        <div>
          <CreateCourseForm />
          <button
            onClick={() => {
              setShowCourseForm(false);
              loadCourses();
            }}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            ← Назад към списъка
          </button>
        </div>
      )}
    </div>
  );
}

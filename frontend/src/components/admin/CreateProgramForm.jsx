import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateProgramForm() {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Взимаме всички курсове от бекенда при зареждане
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/courses/")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Грешка при зареждане на курсове:", err));
  }, []);

  // 🔹 Обработваме чекбоксите
  const handleCourseSelect = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // 🔹 Създаваме нова програма
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/programs/", {
        title: title,
        courses: selectedCourses,
      });
      setMessage("✅ Успешно създадохте нова докторантска програма!");
      setTitle("");
      setSelectedCourses([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Грешка при създаване на програмата!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Създай нова докторантска програма
      </h2>

      {message && <div className="mb-4 text-center text-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Заглавие</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Въведи заглавие..."
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Избери курсове</label>
          <div className="grid grid-cols-2 gap-2">
            {courses.map(course => (
              <label
                key={course.id}
                className="flex items-center gap-2 border rounded p-2 hover:bg-blue-50"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseSelect(course.id)}
                />
                {course.name} ({course.credits} кредита)
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Създаване..." : "Създай програма"}
        </button>
      </form>
    </div>
  );
}

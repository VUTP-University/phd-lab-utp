import { useState } from "react";
import axios from "axios";

export default function CreateCourseForm() {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/courses/", {
        name,
        credits,
      });
      setMessage("✅ Курсът е създаден успешно!");
      setName("");
      setCredits(0);
    } catch (err) {
      console.error(err);
      setMessage("❌ Грешка при създаване на курса!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Създай нов курс
      </h2>
      {message && <p className="text-center mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Име на курса</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Кредити</label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Създай курс
        </button>
      </form>
    </div>
  );
}

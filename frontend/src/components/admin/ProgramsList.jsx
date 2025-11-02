import { useEffect, useState } from "react";
import axios from "axios";

export default function ProgramsList() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/programs/")
      .then(res => setPrograms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Всички програми</h2>
      {programs.length === 0 ? (
        <p>Няма създадени програми.</p>
      ) : (
        <ul className="space-y-3">
          {programs.map(p => (
            <li
              key={p.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <h3 className="font-bold text-blue-800">{p.title}</h3>
              {p.courses && p.courses.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {p.courses.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

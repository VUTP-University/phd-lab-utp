import React from "react";

export default function NewsEvents() {
  return (
    <section className="py-20 bg-background-light test">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          News & Events
        </h2>

        <div className="mt-12 space-y-6 max-w-3xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 border rounded-xl hover:bg-blue-50 transition"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Research Symposium
              </h3>
              <p className="mt-2 text-gray-600">
                Join leading researchers for discussions on emerging technologies.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
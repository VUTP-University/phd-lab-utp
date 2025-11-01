export default function ContactForm() {
  return (
    <section className="bg-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Контактна форма</h2>
        <form className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Име" className="p-3 border rounded-lg w-full" />
          <input type="email" placeholder="Имейл" className="p-3 border rounded-lg w-full" />
          <textarea
            placeholder="Съобщение..."
            className="md:col-span-2 p-3 border rounded-lg h-32"
          ></textarea>
          <button className="md:col-span-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition">
            Изпрати
          </button>
        </form>
      </div>
    </section>
  );
}

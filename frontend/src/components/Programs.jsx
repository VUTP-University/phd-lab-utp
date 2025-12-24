import { useTranslation } from "react-i18next";

export default function Programs() {
  const { t } = useTranslation();
  const programs = t("programs.items", { returnObjects: true });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-blue-800 text-center">
        {t("programs.title")}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((prog, i) => (
          <div
            key={i}
            className="
              bg-white/80 backdrop-blur-md 
              border border-white/60
              rounded-2xl 
              shadow-lg 
              p-8 
              min-h-[360px]
              flex flex-col 
              justify-between
              transition 
              transform 
              hover:scale-[1.03] 
              hover:-translate-y-1 
              hover:shadow-2xl
            "
          >
            <div>
              <h3 className="font-semibold text-xl text-blue-700 mb-3">
                {prog.field}
              </h3>

              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                {prog.program}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold">
                  {t("programs.full")}: {prog.education.full}
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold">
                  {t("programs.part")}: {prog.education.part}
                </span>
              </div>
            </div>

            {/* Бутон */}
            <a
              href={`/conspects/${prog.file}`}
              download
              className="
                mt-6 w-full text-center 
                bg-blue-600 
                text-white 
                py-3 
                rounded-xl 
                text-sm 
                font-semibold 
                hover:bg-blue-700 
                shadow-sm 
                hover:shadow-md 
                transition
              "
            >
              {t("programs.download")}
            </a>
          </div>
          
        ))}
      </div>
    </section>
  );
}

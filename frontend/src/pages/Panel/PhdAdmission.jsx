import Header from "../../components/Header"; // пътят зависи от твоя проект
import data from "../../i18n/phdData.json";
import { useTranslation } from "react-i18next";

export default function PhdAdmission() {
  const { t } = useTranslation();
  const docs = t("phdAdmission.documents", { returnObjects: true });

  return (
    <>
      {/* Header най-отгоре */}
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8">
          {t("phdAdmission.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 mb-10">
          {t("phdAdmission.subtitle")}
        </p>

        {/* Documents List */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <ol className="list-decimal list-inside space-y-4 text-gray-800 leading-relaxed">
            <li>
              {docs["1"]}
              <a
                href={data.pdfs.applicationForm}
                download
                className="ml-4 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                DOCX
              </a>
            </li>
            <li>{docs["2"]}</li>
            <li>{docs["3"]}</li>
            <li>{docs["4"].replace("110", data.applicationFee)}</li>
            <li>
              {docs["5"]}
              <ul className="list-disc list-inside ml-4 mt-2 text-gray-700">
                {docs["5_sub"].map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
                <a
                href={data.pdfs.number_5}
                download
                className="ml-4 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                 DOCX
              </a>
              </ul>
            </li>
            <li>{docs["6"]}</li>
            <li>
              {docs["7"]}
              <a
                href={data.pdfs.consentForm}
                download
                className="ml-4 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                 DOCX
              </a>
            </li>
            <li>
              {docs["8"]}
              <a
                href={data.pdfs.declarationForm}
                download
                className="ml-4 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                 DOCX
              </a>
            </li>
          </ol>
        </div>


        {/* Back button */}
        <div className="mt-12 w-full flex justify-center">
          <a
            href="/"
            className="w-full max-w-lg px-6 py-3 rounded-xl text-lg font-semibold transition shadow-md text-center primary_button"
          >
            {t("phdAdmission.backButton")}
          </a>
        </div>
      </section>
    </>
  );
}

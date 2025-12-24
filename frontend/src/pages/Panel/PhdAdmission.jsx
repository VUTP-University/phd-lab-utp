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

        {/* Announcement */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-xl mt-10 text-blue-900 shadow-sm">
          <h2 className="font-semibold text-xl mb-2">{t("phdAdmission.announcementTitle")}</h2>
          <p>
            {t("phdAdmission.announcementText").replace("2024–2025", data.academicYear)}
          </p>
          <p className="mt-2 font-semibold">
            {t("phdAdmission.deadline").replace("21.05.2025", data.deadline)}
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 p-6 rounded-xl shadow mt-10 text-gray-800">
          <h3 className="font-semibold text-lg mb-2 text-blue-700">{t("phdAdmission.contactTitle")}</h3>
          <p>{data.contact.address}</p>
          <p>{data.contact.office}</p>
          <p><strong>{data.contact.phone}</strong></p>
        </div>

        {/* Back button */}
        <div className="mt-12 w-full flex justify-center">
          <a
            href="/"
            className="w-full max-w-lg bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition shadow-md hover:shadow-lg text-center"
          >
            {t("phdAdmission.backButton")}
          </a>
        </div>
      </section>
    </>
  );
}

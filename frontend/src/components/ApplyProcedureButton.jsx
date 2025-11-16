import { useTranslation } from "react-i18next";

export default function ApplyProcedureButton() {
  const { t } = useTranslation();

  return (
    <div className="mt-8 w-full flex justify-center">
      <a
        href="/phd-admission"
        className="
          w-full max-w-xs md:max-w-md lg:max-w-lg
          bg-blue-700 text-white px-6 py-3 rounded-xl
          text-lg font-semibold
          hover:bg-blue-800 transition
          shadow-md hover:shadow-lg
          text-center
        "
      >
        {t("programs.applyProcedure")}
      </a>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-blue-900 text-white py-8 relative">
      <LanguageSwitcher />
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("header.title")}</h1>
        <p className="text-sm text-blue-200">{t("header.subtitle")}</p>
      </div>
    </header>
  );
}

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const links = t("footer.links", { returnObjects: true });

  return (
    <footer className="bg-blue-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p>{t("footer.rights")}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">{t("footer.linksTitle")}</h4>
          <ul className="flex flex-wrap gap-4">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.link} className="hover:underline">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">{t("footer.contactTitle")}</h4>
          <p>{t("footer.email")}</p>
        </div>
      </div>
    </footer>
  );
}

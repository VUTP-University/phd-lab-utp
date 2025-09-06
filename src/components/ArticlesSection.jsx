import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const ArticlesSection = () => {
  const articles = [
    {
      title: "Докторантско училище",
      links: [
        { text: "Правилник Докторантско училище", url: "#", icon: "fas fa-book" },
        { text: "График", url: "#", icon: "fas fa-calendar-alt" },
        { text: "Учебен план и кредитна система", url: "#", icon: "fas fa-graduation-cap" },
      ],
    },
    {
      title: "Онлайн класна стая (за регистрирани докторанти)",
      links: [
        { text: "Вход", url: "#", icon: "fas fa-door-open" },
      ],
    },
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center g-4">
        {articles.map((article, index) => (
          <div className="col-lg-6" key={index}>
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              
              {/* Заглавие на статията */}
              <div className=" text-white p-3" style={{ backgroundColor: '#294a70'}}>
                <h5 className="mb-0">
                  <i className="fas fa-file-alt me-2"></i>
                  {article.title}
                </h5>
              </div>

              {/* Съдържание */}
              <div className="p-4 bg-light">
                <ul className="list-unstyled mb-0">
                  {article.links.map((link, i) => (
                    <li key={i} className="mb-2">
                      <a 
                        href={link.url} 
                        className="text-decoration-none d-flex align-items-center"
                        style={{ color: "#49688e", fontWeight: "500" }}
                      >
                        <i className={`${link.icon} me-2 text-warning`}></i>
                        {link.text}
                        <i className="fas fa-arrow-right ms-auto text-secondary"></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesSection;

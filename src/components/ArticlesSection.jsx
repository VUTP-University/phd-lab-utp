import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const ArticlesSection = () => {
  // Можеш да добавяш колкото статии искаш
  const articles = [
    {
      title: "Докторантско училище",
      links: [
        { text: "Правилник Докторантско училище", url: "#" },
        { text: "График", url: "#" },
        { text: "Учебен план и кредитна система", url: "#" },
      ],
    },
    {
      title: "Онлайн класна стая (за регистрирани докторанти)",
      links: [
        { text: "Вход", url: "#" },
      ],
    },
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {articles.map((article, index) => (
          <div className="col-lg-8 mb-4" key={index}>
            <div className="card shadow-sm">
              <div className="row g-0">
                
                {/* Лого */}
                <div className="col-md-2 d-flex align-items-center justify-content-center p-3">
                  
                </div>

                {/* Съдържание */}
                <div className="col-md-10 p-3">
                  <h5 className="card-title">{article.title}</h5>
                  <ul className="list-unstyled mb-0">
                    {article.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} className="text-decoration-none">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesSection;

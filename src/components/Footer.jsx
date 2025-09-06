import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="pt-5 pb-4 border-top text-white"
      style={{ backgroundColor: "#49688e" }}
    >
      <div className="container">
        <div className="row">

          {/* Контакти */}
          <div className="col-md-3 mb-4">
            <h5>За контакти:</h5>
            <p className="mb-1">02/4120225</p>
            <p className="mb-1">Адрес: гр. София</p>
            <p className="mb-1">ул. „Акад. Стефан Младенов" 1</p>
            <p className="mb-1">Учебен отдел: (02) 8062180 / +359 882431872</p>
            <a href="mailto:admission@utp.bg" className="text-white">admission@utp.bg</a>
          </div>

          {/* Актуално */}
          <div className="col-md-3 mb-4">
            <h5>Актуално:</h5>
            <ul className="list-unstyled">
              <li><a href="/begin/competitions/" className="text-white">Конкурси и Търгове</a></li>
              <li><a href="/research-activities/academic-development/" className="text-white">Кариера във ВУТП</a></li>
              <li><a href="/news/buyer-profile/" className="text-white">Профил на купувача</a></li>
              <li><a href="/news/budget/" className="text-white">Бюджет</a></li>
              <li><a href="/category/%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8/" className="text-white">Новини</a></li>
              <li><a href="https://www.utp.bg/%d0%bf%d0%be%d0%bb%d0%b8%d1%82%d0%b8%d0%ba%d0%b0-%d0%b7%d0%b0-%d0%bb%d0%b8%d1%87%d0%bd%d0%b8%d1%82%d0%b5-%d0%b4%d0%b0%d0%bd%d0%bd%d0%b8/" className="text-white">Политика за личните данни</a></li>
              <li><a href="https://www.utp.bg/priemno-vreme-na-prepodavatelite/" className="text-white">Приемно време на преподавателите</a></li>
              <li><a href="https://www.utp.bg/karta-na-saita/" className="text-white">Карта на сайта</a></li>
              <li><a href="https://www.utp.bg/deklaraciq-za-dostupnost/" className="text-white">Декларация за достъпност</a></li>
            </ul>
          </div>

          {/* Информация */}
          <div className="col-md-3 mb-4">
            <h5>Информация:</h5>
            <ul className="list-unstyled">
              <li><a href="/training/students/where-and-how-to-pay/" className="text-white">Къде и как да платя</a></li>
              <li><a href="/begin/admission-of-students/taxes/" className="text-white">Такси за обучение</a></li>
              <li><a href="/students/dormitories/" className="text-white">Общежития</a></li>
              <li><a href="/students/career-development/job-and-internship/" className="text-white">Работа и стаж</a></li>
              <li><a href="/international-activities/mobility/erasmus/" className="text-white">Еразъм +</a></li>
              <li><a href="https://www.utp.bg/international-activities/mobility/erasmus/erasmus-incoming-students/" className="text-white">ERASMUS+ Incoming students</a></li>
            </ul>

            {/* Банер */}
            <div className="mt-3">
              <a href="/smart-phd-lab-5-0/">
                <img
                  src="https://www.utp.bg/wp-content/uploads/2024/12/banner-eu-13-12-2024.jpg"
                  alt="Банер"
                  className="img-fluid"
                />
              </a>
            </div>
          </div>

          {/* Facebook */}
          <div className="col-md-3 mb-4">
            <h5>Facebook страница</h5>
            <div
              className="fb-page"
              data-href="https://www.facebook.com/www.utp.bg/"
              data-width="250"
              data-height="200"
              data-small-header="true"
              data-hide-cover="false"
              data-show-facepile="true"
              data-tabs="timeline"
            >
              <blockquote
                cite="https://www.facebook.com/www.utp.bg/"
                className="fb-xfbml-parse-ignore"
              >
                <a href="https://www.facebook.com/www.utp.bg/" className="text-white">
                  Висше училище по телекомуникации и пощи
                </a>

              </blockquote>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

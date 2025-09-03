import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MainNav = () => {
  return (
    <>
      <style>{`
        /* всички линкове в навигацията - бели */
        .navbar-nav .nav-link,
        .navbar-nav .dropdown-item {
          color: #fff !important;
        }

        /* hover ефект за линковете */
        .navbar-nav .nav-link:hover,
        .navbar-nav .dropdown-item:hover {
          background-color: #ffbc58 !important;
        }

        /* показване на dropdown меню при hover */
        .nav-item.dropdown:hover .dropdown-menu {
          display: block;
          margin-top: 0;
        }

        /* подменю */
        .dropdown-submenu {
          position: relative;
        }

        .dropdown-submenu:hover > .dropdown-menu {
          display: block;
          top: 0;
          left: 100%;
          margin-left: 0.1rem;
        }

        /* фон на dropdown-а */
        .dropdown-menu {
          background-color: #49688e;
        }
          .dropdown-menu li:hover {
  background-color: #ffbc58;
}

.dropdown-menu li:hover > a {
  color: #fff !important;
}

        /* линкове в dropdown-а */
        .dropdown-menu .dropdown-item {
          color: #fff !important;
        }

      .navbar .nav-link,
.navbar .dropdown-item {
  color: black !important;
}
}
      `}</style>

      <nav
        className="navbar navbar-expand-lg navbar-light border-top border-bottom"
        style={{ backgroundColor: '#294a70', color:'black' }}
      >
        <div className="container">
          {/* Hamburger за мобилни */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* За ВУТП */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="https://www.utp.bg/"
                  id="aboutDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  За ВУТП
                </a>
                <ul className="dropdown-menu" aria-labelledby="aboutDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/history/"
                    >
                      История на ВУТП
                    </a>
                  </li>
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="https://www.utp.bg/%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/"
                    >
                      Ръководство
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/%d0%b0%d0%ba%d0%b0%d0%b4%d0%b5%d0%bc%d0%b8%d1%87%d0%bd%d0%be-%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/"
                        >
                          Академично ръководство
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/%d0%be%d0%b1%d1%89%d0%be-%d1%81%d1%8a%d0%b1%d1%80%d0%b0%d0%bd%d0%b8%d0%b5/"
                        >
                          Общо събрание
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/kontrolen-savet/"
                        >
                          Контролен съвет
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/divisions/"
                    >
                      Администрация
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/vrazki-obshtestvenostta/"
                    >
                      Връзки с обществеността
                    </a>
                  </li>
                </ul>
              </li>

              {/* Прием */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="admissionDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Прием
                </a>
                <ul className="dropdown-menu" aria-labelledby="admissionDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/admission-of-students/taking-professional-bachelors/"
                    >
                      Професионални бакалаври
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/%d0%bf%d1%80%d0%b8%d0%b5%d0%bc-%d0%bd%d0%b0-%d0%b1%d0%b0%d0%ba%d0%b0%d0%bb%d0%b0%d0%b2%d1%80%d0%b8/"
                    >
                      Бакалаври
                    </a>
                  </li>
                </ul>
              </li>

              {/* Обучение */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="educationDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Обучение
                </a>
                <ul className="dropdown-menu" aria-labelledby="educationDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/%d1%84%d0%b0%d0%ba%d1%83%d0%bb%d1%82%d0%b5%d1%82/"
                    >
                      Факултет
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/%d0%b4%d0%b5%d0%bf%d0%b0%d1%80%d1%82%d0%b0%d0%bc%d0%b5%d0%bd%d1%82/"
                    >
                      Департамент
                    </a>
                  </li>
                </ul>
              </li>

              {/* Студенти */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="studentsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Студенти
                </a>
                <ul className="dropdown-menu" aria-labelledby="studentsDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/students/student-council/"
                    >
                      Студентски съвет
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/students/career-development/job-and-internship/"
                    >
                      Работа
                    </a>
                  </li>
                </ul>
              </li>

              {/* Научна дейност */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="researchDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Научна дейност
                </a>
                <ul className="dropdown-menu" aria-labelledby="researchDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/research-activities/e-books/"
                    >
                      e-books
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/research-activities/strategy/"
                    >
                      Стратегия
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/research-activities/scientific-council/"
                    >
                      Научен съвет
                    </a>
                  </li>
                  <li className="dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#">
                      Проекти и програми
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/smart-phd-lab-5-0/"
                        >
                          Смарт PHD Lab 5.0
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.utp.bg/research-activities/conferences/"
                    >
                      Конференции
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/research-activities/contests/"
                    >
                      Конкурси
                    </a>
                  </li>
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="https://www.utp.bg/research-activities/academic-development/"
                    >
                      Кадрово развитие
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/"
                        >
                          Текущи конкурси
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/past-competitions/"
                        >
                          Минали конкурси
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/procedures/current-competitions/"
                        >
                          Текущи процедури
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/procedures/past-competitions/"
                        >
                          Минали процедури
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/regulatory/"
                        >
                          Нормативна уредба
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/public-lectures/"
                        >
                          Публични лекции
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="https://www.utp.bg/research-activities/academic-development/contacts/"
                        >
                          Контакти
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle"
    href="#"
    id="internationalDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Международна дейност
  </a>
  <ul className="dropdown-menu" aria-labelledby="internationalDropdown">
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/international-activities/mobility/erasmus/"
      >
        Еразъм +
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/international-activities/partners/"
      >
        Партньори
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/international-activities/academic-cooperation/"
      >
        Академично сътрудничество
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/international-activities/membership-in-organizations/"
      >
        Членство в организации
      </a>
    </li>
  </ul>
</li>
{/* Събития */}
<li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle"
    href="/category/новини/"
    id="eventsDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Събития
  </a>
  <ul className="dropdown-menu" aria-labelledby="eventsDropdown">
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/category/новини/"
      >
        Новини
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/кръгла-маса/"
      >
        Кръгла маса
      </a>
    </li>
    <li>
      <a className="dropdown-item" href="/news/gallery/">
        Фото галерия
      </a>
    </li>
    <li>
      <a className="dropdown-item" href="https://www.utp.bg/video-galeriq/">
        Видео галерия
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/category/събития/"
      >
        Събития
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/поздравителни-адреси/"
      >
        Поздравителни адреси послучай 140 години ВУТП
      </a>
    </li>

    {/* Подменю: Иновативно образование и професии на бъдещето */}
    <li className="dropdown-submenu">
      <a className="dropdown-item dropdown-toggle" href="#">
        Иновативно образование и професии на бъдещето
      </a>
      <ul className="dropdown-menu">
        <li>
          <a
            className="dropdown-item"
            href="https://www.utp.bg/inovativno-obrazovanie-profesii-badeshteto-2024-2025/"
          >
            2024-2025
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="https://www.utp.bg/inovativno-obrazovanie-profesii-badeshteto/"
          >
            2023-2024
          </a>
        </li>
      </ul>
    </li>

    <li>
      <a
        className="dropdown-item"
        href="https://www.utp.bg/programa-women-in-tech-jenite-tehnologiite/"
      >
        Програма “Women in Tech – Жените в технологиите”
      </a>
    </li>
  </ul>
</li>

              
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNav;

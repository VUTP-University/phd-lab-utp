import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MainNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-top border-bottom">
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
              <a className="nav-link dropdown-toggle" href="https://www.utp.bg/" id="aboutDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                За ВУТП
              </a>
              <ul className="dropdown-menu" aria-labelledby="aboutDropdown">
                <li><a className="dropdown-item" href="https://www.utp.bg/history/">История на ВУТП</a></li>
                <li className="dropdown-submenu">
                  <a className="dropdown-item dropdown-toggle" href="https://www.utp.bg/%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/">Ръководство</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="https://www.utp.bg/%d0%b0%d0%ba%d0%b0%d0%b4%d0%b5%d0%bc%d0%b8%d1%87%d0%bd%d0%be-%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/">Академично ръководство</a></li>
                    <li><a className="dropdown-item" href="https://www.utp.bg/%d0%be%d0%b1%d1%89%d0%be-%d1%81%d1%8a%d0%b1%d1%80%d0%b0%d0%bd%d0%b8%d0%b5/">Общо събрание</a></li>
                    <li><a className="dropdown-item" href="https://www.utp.bg/%d1%80%d1%8a%d0%ba%d0%be%d0%b2%d0%be%d0%b4%d1%81%d1%82%d0%b2%d0%be/kontrolen-savet/">Контролен съвет</a></li>
                  </ul>
                </li>
                <li><a className="dropdown-item" href="https://www.utp.bg/divisions/">Администрация</a></li>
                <li><a className="dropdown-item" href="https://www.utp.bg/vrazki-obshtestvenostta/">Връзки с обществеността</a></li>
              </ul>
            </li>

            {/* Прием */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="admissionDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Прием
              </a>
              <ul className="dropdown-menu" aria-labelledby="admissionDropdown">
                <li><a className="dropdown-item" href="https://www.utp.bg/admission-of-students/taking-professional-bachelors/">Професионални бакалаври</a></li>
                <li><a className="dropdown-item" href="https://www.utp.bg/%d0%bf%d1%80%d0%b8%d0%b5%d0%bc-%d0%bd%d0%b0-%d0%b1%d0%b0%d0%ba%d0%b0%d0%bb%d0%b0%d0%b2%d1%80%d0%b8/">Бакалаври</a></li>
              </ul>
            </li>

            {/* Обучение */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="educationDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Обучение
              </a>
              <ul className="dropdown-menu" aria-labelledby="educationDropdown">
                <li><a className="dropdown-item" href="https://www.utp.bg/%d1%84%d0%b0%d0%ba%d1%83%d0%bb%d1%82%d0%b5%d1%82/">Факултет</a></li>
                <li><a className="dropdown-item" href="https://www.utp.bg/%d0%b4%d0%b5%d0%bf%d0%b0%d1%80%d1%82%d0%b0%d0%bc%d0%b5%d0%bd%d1%82/">Департамент</a></li>
              </ul>
            </li>

            {/* Студенти */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="studentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Студенти
              </a>
              <ul className="dropdown-menu" aria-labelledby="studentsDropdown">
                <li><a className="dropdown-item" href="https://www.utp.bg/students/student-council/">Студентски съвет</a></li>
                <li><a className="dropdown-item" href="https://www.utp.bg/students/career-development/job-and-internship/">Работа</a></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;

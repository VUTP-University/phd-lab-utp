import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TopHeader = () => {
  return (
    <div style={{ backgroundColor: '#49688e' }} className="py-2 border-bottom">
      <div className="container d-flex flex-wrap align-items-center justify-content-between text-white">

        {/* Онлайн новини */}
        <div className="d-flex align-items-center gap-2">
          <strong>Онлайн:</strong>
          <p className="mb-0">
            <a href="http://priem.utp.bg" className="text-white text-decoration-underline">Кандидатстване</a> /{' '}
            <a href="https://elearning.utp.bg/mod/quiz/view.php?id=4492" className="text-white text-decoration-underline">
              ON-Line доброволен тест за кандидатстване - 2024/2025
            </a>
          </p>
        </div>

        {/* Бърз достъп с dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Бърз достъп
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/training/students/where-and-how-to-pay/">Къде и как да платя</a></li>
            <li><a className="dropdown-item" href="/begin/admission-of-students/taxes/">Такси за обучение</a></li>
            <li><a className="dropdown-item" href="/students/dormitories/">Общежития</a></li>
            <li><a className="dropdown-item" href="/students/career-development/job-and-internship/">Работа и стаж</a></li>
            <li><a className="dropdown-item" href="/international-activities/mobility/erasmus/">Еразъм +</a></li>
            <li><a className="dropdown-item" href="https://www.utp.bg/international-activities/mobility/erasmus/erasmus-incoming-students/">ERASMUS+ Incoming students</a></li>
          </ul>
        </div>

        {/* Социални икони */}
        <div className="d-flex gap-2">
          <a href="https://www.facebook.com/www.utp.bg/" className="btn btn-sm btn-primary">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/" className="btn btn-sm btn-info text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

      </div>
    </div>
  );
};

export default TopHeader;

import React, { useState } from 'react';
import './Navbar.css'; // Импортираме CSS

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="navbar">
      <ul className="menu">
        <li><a href="/">Начало</a></li>

        <li className="dropdown">
          <button onClick={() => toggleDropdown('zaNas')}>
            За нас ▼
          </button>
          {openDropdown === 'zaNas' && (
            <ul className="dropdown-menu">
              <li><a href="/istoria">История</a></li>
              <li><a href="/mision">Мисия</a></li>
              <li><a href="/administracia">Администрация</a></li>
            </ul>
          )}
        </li>

        <li className="dropdown">
          <button onClick={() => toggleDropdown('fakulteti')}>
            Факултети ▼
          </button>
          {openDropdown === 'fakulteti' && (
            <ul className="dropdown-menu">
              <li><a href="/fakultet-tehnologii">Технологии</a></li>
              <li><a href="/fakultet-ekonomika">Икономика</a></li>
            </ul>
          )}
        </li>

        <li><a href="/novini">Новини</a></li>
        <li><a href="/kontakt">Контакт</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;

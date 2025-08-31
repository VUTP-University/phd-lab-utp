import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <header id="masthead" className="site-header py-3">
      <div className="container d-flex align-items-center">

        {/* Site Branding */}
        <div className="site-branding d-flex align-items-center gap-3">
          <a href="https://www.utp.bg/" className="custom-logo-link">
            <img
              width="288"
              height="103"
              src="https://www.utp.bg/wp-content/uploads/2024/07/cropped-logo140.jpg"
              className="custom-logo"
              alt="ВИСШЕ УЧИЛИЩЕ ПО ТЕЛЕКОМУНИКАЦИИ И ПОЩИ"
            />
          </a>
          <div id="site-identity">
            <p className="site-title mb-0">
              <a href="https://www.utp.bg/" className="text-decoration-none text-dark">
                ВИСШЕ УЧИЛИЩЕ ПО ТЕЛЕКОМУНИКАЦИИ И ПОЩИ
              </a>
            </p>
            <p className="site-description mb-0"></p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

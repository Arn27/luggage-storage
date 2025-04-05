import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLang(false); // Optional: close dropdown after selection
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
      <Link to="/" className="navbar-logo">BagStorage</Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <div className="navbar-actions">
          <button className="btn">{t("partner_signup")}</button>
          <button className="btn">{t("traveller_signup")}</button>

          <div className="language-dropdown">
            <button className="language-toggle" onClick={() => setShowLang(!showLang)}>
              🌐
            </button>
            {showLang && (
              <div className="language-options">
                <img src="/flags/gb.svg" alt="English" onClick={() => changeLanguage("en")} />
                <img src="/flags/lt.svg" alt="Lietuvių" onClick={() => changeLanguage("lt")} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

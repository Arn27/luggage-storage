import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const user = localStorage.getItem("user");
      setCurrentUser(user ? JSON.parse(user) : null);
    };
  
    syncUser(); // on mount
  
    window.addEventListener("storage", syncUser);
    window.addEventListener("userChanged", syncUser);
  
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userChanged", syncUser);
    };
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/";
  };
  

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLang(false);
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
        {currentUser ? (
          <>
            <Link to="/user" className="btn user-btn">
              👤 {currentUser.name}
            </Link>
            <button className="btn" onClick={handleLogout}>{t("logout")}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">{t("login")}</Link>
            <Link to="/register" className="btn">{t("traveller_signup")}</Link>
            <Link to="/register/business" className="btn">{t("partner_signup")}</Link>
          </>
        )}
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
    </nav>
  );
}

export default Navbar;

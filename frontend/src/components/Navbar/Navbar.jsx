import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [hasActiveBooking, setHasActiveBooking] = useState(false); // NEW

  useEffect(() => {
    const syncUser = () => {
      const user = localStorage.getItem("user");
      const roles = localStorage.getItem("roles");
      setCurrentUser(user ? JSON.parse(user) : null);
      setRoles(roles ? JSON.parse(roles) : []);
    };

    syncUser();
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
    localStorage.removeItem("roles");
    setCurrentUser(null);
    setRoles([]);
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/";
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLang(false);
  };

  const isAdmin = roles.includes("admin");
  const isBusiness = roles.includes("business");
  const isTraveller = roles.includes("traveller");

  useEffect(() => {
    const checkActiveBooking = async () => {
      if (!roles.includes("traveller")) return;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/user/booking/active", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (data?.id) setHasActiveBooking(true);
      } catch (err) {
        console.error("Failed to check active booking", err);
      }
    };

    checkActiveBooking();
  }, [roles]);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" state={{ fromNavbar: true }} className="navbar-logo">BagStorage</Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        {currentUser ? (
          <>
            {isTraveller && hasActiveBooking && (
              <Link to="/user/booking/active" className="btn highlight-active-booking">
                📦 {t("active_booking")}
              </Link>
            )}
            {(isTraveller || isAdmin) && (
              <Link to="/user" className="btn user-btn">
                👤 {currentUser.name}
              </Link>
            )}
            {isBusiness && !isAdmin && (
              <Link to="/business" className="btn user-btn">
                🧳 {currentUser.name}
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="btn">{t("admin_panel")}</Link>
            )}
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

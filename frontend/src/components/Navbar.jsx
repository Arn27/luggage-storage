import React from "react";

function Navbar({ language, setLanguage }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">BagStorage</div>
      <div className="navbar-actions">
        <button className="btn">{language === "en" ? "Partner Sign Up" : "Registruotis kaip partneriui"}</button>
        <button className="btn">{language === "en" ? "Traveller Sign Up" : "Registruotis kaip keliautojui"}</button>
        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="lt">LT</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar;

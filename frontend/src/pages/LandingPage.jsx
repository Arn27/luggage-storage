import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LandingPage() {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [bags, setBags] = useState(1);

  return (
    <section className="landing-wrapper">
      <h1 className="landing-title">{t("welcome")}</h1>
      <p className="landing-subtitle">{t("subtitle")}</p>
      <div className="search-panel">
        <input
          type="text"
          placeholder={t("city")}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <input
          type="number"
          min="1"
          value={bags}
          onChange={(e) => setBags(e.target.value)}
          className="input"
        />
        <button className="btn btn-search">{t("search")}</button>
      </div>
    </section>
  );
}

export default LandingPage;

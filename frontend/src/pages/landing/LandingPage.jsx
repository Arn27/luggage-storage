import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [date, setDate] = useState(null);
  const [bags, setBags] = useState(1);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (roles.includes("business")) {
      navigate("/business");
    }
  }, [navigate]);

  return (
    <section className="landing-bg">
      <div className="landing-content">
        <h1 className="landing-title">{t("welcome")}</h1>
        <p className="landing-subtitle">{t("subtitle")}</p>
        <div className="search-panel">
          <div className="input-group">
            <label>{t("city")}</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input"
            />
          </div>

          <div className="input-group">
            <label>{t("date")}</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="input"
              placeholderText={t("select_date")}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-start"
            />
          </div>

          <div className="input-group">
            <label>{t("bags")}</label>
            <input
              type="number"
              min="1"
              value={bags}
              onChange={(e) => setBags(e.target.value)}
              className="input"
              placeholder={t("bags_placeholder")}
            />
          </div>

          <button
            className="btn btn-search"
            onClick={() => {
              if (city && date && bags) {
                const formattedDate = date.toISOString().split("T")[0];
                navigate(`/search?city=${city}&date=${formattedDate}&bags=${bags}`);
              }
            }}
          >
            {t("search")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;

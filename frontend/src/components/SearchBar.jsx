import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import './SearchBar.css';

const SearchBar = ({
  initialCity = "",
  initialDate = null,
  initialBags = 1,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [city, setCity] = useState(initialCity);
  const [date, setDate] = useState(initialDate);
  const [bags, setBags] = useState(initialBags);

  const handleSearch = () => {
    if (city && date && bags) {
      const formattedDate = date.toISOString().split("T")[0];
      navigate(`/search?city=${city}&date=${formattedDate}&bags=${bags}`);
    }
  };

  return (
    <div className="results-search-bar-container">
      <div className="results-search-bar">
        <div className="results-input-group">
          <label>{t("city")}</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="results-input"
          />
        </div>

        <div className="results-input-group">
          <label>{t("date")}</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="results-input"
            placeholderText={t("select_date")}
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom-start"
            minDate={new Date()}
          />
        </div>

        <div className="results-input-group">
          <label>{t("bags")}</label>
          <input
            type="number"
            min="1"
            value={bags}
            onChange={(e) => setBags(e.target.value)}
            className="results-input"
            placeholder={t("bags_placeholder")}
          />
        </div>

        <button className="results-search-btn" onClick={handleSearch}>
          {t("search")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

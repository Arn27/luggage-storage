import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './LocationDetail.css';


const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/locations/${id}`);
        const data = await res.json();
        setLocation(data);
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    };

    fetchLocation();
  }, [id]);

  if (!location) return <p>{t("loading")}</p>;

  return (
    <div className="location-page">
    <button className="back-button" onClick={() => navigate(-1)}>
      ← {t("back")}
    </button>
  
    <img
      src={location.image_url || "https://fakeimg.pl/600x400"}
      alt={location.name}
      className="location-image"
    />
  
    {/* 👇 This is the flex row: info left + form right */}
    <div className="location-content">
      <div className="location-info">
        <h1>{location.name}</h1>
        <p>📍 {location.address}, {location.city}</p>
        <p>🧳 {t("max_bags")}: {location.max_bags}</p>
        <p>⏰ {t("open_hours")}: {location.open_hours.from}–{location.open_hours.to}</p>
        <p>📝 {t("description")}: {location.description}</p>
      </div>
  
      <div className="booking-form">
        <h2>{t("book_now")}</h2>
  
        <div className="form-row">
          <label>
            {t("date")}
            <input type="date" />
          </label>
  
          <label>
            {t("bags")}
            <input type="number" min="1" defaultValue="1" />
          </label>
        </div>
  
        <button className="book-button">{t("confirm_booking")}</button>
      </div>
    </div>
  </div>
  
  );
};

export default LocationDetail;

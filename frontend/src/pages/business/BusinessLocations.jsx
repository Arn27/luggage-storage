import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/BusinessLocations.css";

const BusinessLocations = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:8000/api/business/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Server error:", res.status, text);
          return;
        }

        const data = await res.json();

        const parsedData = data.map((loc) => {
          if (typeof loc.open_hours === "string") {
            try {
              loc.open_hours = JSON.parse(loc.open_hours);
            } catch {
              loc.open_hours = { from: "?", to: "?" };
            }
          }
          return loc;
        });

        setLocations(parsedData);
      } catch (err) {
        console.error("Failed to load locations", err);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="business-locations-page">
      <div className="locations-header">
        <h1>{t("your_locations")}</h1>
        <Link to="/business/locations/new" className="btn create-btn">
          + {t("add_new_location")}
        </Link>
      </div>

      <div className="locations-list">
        {locations.map((loc) => (
          <div key={loc.id} className="location-card">
            <h2>{loc.name}</h2>
            <p>{loc.address}, {loc.city}</p>
            <p>🧳 {t("max_bags")}: {loc.max_bags}</p>
            <p>⏰ {t("open_hours")}: {loc.open_hours?.from}–{loc.open_hours?.to}</p>
            <Link to={`/business/locations/${loc.id}`} className="btn small-btn">{t("manage")}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessLocations;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const ActiveBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/user/booking/active", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBooking)
      .catch((err) => console.error("Failed to fetch active booking", err));
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  if (!roles.includes("user")) {
    navigate("/");
    return null;
  }

  return (
    <div className="dashboard-container">
      <h1>{t("active_booking")}</h1>

      {!booking ? (
        <p>{t("no_active_booking")}</p>
      ) : (
        <div className="dashboard-section">
          <h2>{booking.location?.name}</h2>
          <p><strong>{t("date")}:</strong> {new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>{t("bags")}:</strong> {booking.bag_count}</p>
          <p><strong>{t("start")}:</strong> {booking.started_at ? new Date(booking.started_at).toLocaleString() : t("not_started")}</p>
          <p><strong>{t("status")}:</strong> {t(booking.status)}</p>
        </div>
      )}
    </div>
  );
};

export default ActiveBookings;
